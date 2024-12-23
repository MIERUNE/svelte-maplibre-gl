<script lang="ts">
	import { MapLibre, CustomLayer } from 'svelte-maplibre-gl';
	import maplibregl from 'maplibre-gl';

	class CustomLayerImpl implements Omit<maplibregl.CustomLayerInterface, 'id' | 'type'> {
		program: WebGLProgram | null = null;
		aPos: number = 0;
		buffer: WebGLBuffer | null = null;

		onAdd(_map: maplibregl.Map, gl: WebGL2RenderingContext) {
			//create GLSL source for vertex shader
			const vertexSource = `#version 300 es
			uniform mat4 u_matrix;
			in vec2 a_pos;
			void main() {
					gl_Position = u_matrix * vec4(a_pos, 0.0, 1.0);
			}`;

			// create GLSL source for fragment shader
			const fragmentSource = `#version 300 es
			out highp vec4 fragColor;
			void main() {
					fragColor = vec4(1.0, 0.0, 0.0, 0.5);
			}`;

			// create a vertex shader
			const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
			gl.shaderSource(vertexShader, vertexSource);
			gl.compileShader(vertexShader);

			// create a fragment shader
			const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
			gl.shaderSource(fragmentShader, fragmentSource);
			gl.compileShader(fragmentShader);

			// link the two shaders into a WebGL program
			this.program = gl.createProgram()!;
			gl.attachShader(this.program, vertexShader);
			gl.attachShader(this.program, fragmentShader);
			gl.linkProgram(this.program);

			this.aPos = gl.getAttribLocation(this.program, 'a_pos');

			// define vertices of the triangle to be rendered in the custom style layer
			const helsinki = maplibregl.MercatorCoordinate.fromLngLat({ lng: 25.004, lat: 60.239 });
			const berlin = maplibregl.MercatorCoordinate.fromLngLat({ lng: 13.403, lat: 52.562 });
			const kyiv = maplibregl.MercatorCoordinate.fromLngLat({ lng: 30.498, lat: 50.541 });

			// create and initialize a WebGLBuffer to store vertex and color data
			this.buffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
			gl.bufferData(
				gl.ARRAY_BUFFER,
				new Float32Array([helsinki.x, helsinki.y, berlin.x, berlin.y, kyiv.x, kyiv.y]),
				gl.STATIC_DRAW
			);
		}

		// method fired on each animation frame
		render(gl: WebGL2RenderingContext | WebGLRenderingContext, options: maplibregl.CustomRenderMethodInput) {
			gl.useProgram(this.program);
			gl.uniformMatrix4fv(
				gl.getUniformLocation(this.program!, 'u_matrix'),
				false,
				options.defaultProjectionData.mainMatrix
			);
			gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
			gl.enableVertexAttribArray(this.aPos);
			gl.vertexAttribPointer(this.aPos, 2, gl.FLOAT, false, 0, 0);
			gl.enable(gl.BLEND);
			gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3);
		}
	}
</script>

<MapLibre
	class="h-[55vh] min-h-[300px]"
	style="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
	zoom={3}
	center={[20, 58]}
>
	<CustomLayer implementation={new CustomLayerImpl()} />
</MapLibre>
