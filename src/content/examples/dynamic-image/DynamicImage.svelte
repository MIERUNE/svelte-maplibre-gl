<script lang="ts">
	import 'svelte-maplibre-gl/vite'; // Required only for GL JS v6+
	import type * as maplibregl from 'maplibre-gl';
	import { MapLibre, Image, GeoJSONSource, SymbolLayer } from 'svelte-maplibre-gl';

	const SIZE = 128;
	const CITIES = [
		[141.35, 43.06],
		[139.69, 35.68],
		[136.91, 35.18],
		[135.5, 34.69],
		[132.46, 34.4],
		[130.4, 33.59]
	];

	const VERTEX_SHADER = `#version 300 es
	const vec2 p[3] = vec2[3](vec2(-1, -1), vec2(3, -1), vec2(-1, 3));
	out vec2 uv;
	void main() { gl_Position = vec4(p[gl_VertexID], 0, 1); uv = p[gl_VertexID] * .5 + .5; }`;

	const FRAGMENT_SHADER = `#version 300 es
	precision highp float;
	in vec2 uv; uniform float time; out vec4 color;
	void main() {
		vec2 p = uv * 2. - 1.; float r = length(p), a = atan(p.y, p.x);
		float ring = .02 / abs(r - .48 - .07 * sin(a * 6. - time * 2.));
		float spark = .015 / abs(length(p - .55 * vec2(cos(time), sin(time))) - .06);
		float alpha = smoothstep(1., .72, r) * clamp(.08 + ring + spark, 0., 1.);
		vec3 neon = .5 + .5 * cos(time + r * 7. + vec3(0., 2., 4.));
		color = vec4(neon * alpha, alpha);
	}`;

	let map: maplibregl.Map | undefined;
	let gl: WebGL2RenderingContext | undefined;
	let program: WebGLProgram | null;
	let framebuffer: WebGLFramebuffer | null;
	let timeLocation: WebGLUniformLocation | null;

	function compileShader(context: WebGL2RenderingContext, type: number, source: string) {
		const shader = context.createShader(type)!;
		context.shaderSource(shader, source);
		context.compileShader(shader);
		return shader;
	}

	function setup(context: WebGL2RenderingContext) {
		gl = context;
		program = context.createProgram();
		context.attachShader(program!, compileShader(context, context.VERTEX_SHADER, VERTEX_SHADER));
		context.attachShader(program!, compileShader(context, context.FRAGMENT_SHADER, FRAGMENT_SHADER));
		context.linkProgram(program!);
		timeLocation = context.getUniformLocation(program!, 'time');
		framebuffer = context.createFramebuffer();
	}

	function destroy() {
		if (!gl) return;
		gl.deleteProgram(program);
		gl.deleteFramebuffer(framebuffer);
		gl = undefined;
		program = framebuffer = timeLocation = null;
	}

	const gpuImage: maplibregl.StyleImageInterface = {
		width: SIZE,
		height: SIZE,
		onAdd(value) {
			map = value;
		},
		render() {
			map?.triggerRepaint();
			return true;
		},
		data: {
			renderWithWebGL(target) {
				if (gl !== target.gl) setup(target.gl);
				target.gl.bindFramebuffer(target.gl.FRAMEBUFFER, framebuffer);
				target.gl.framebufferTexture2D(
					target.gl.FRAMEBUFFER,
					target.gl.COLOR_ATTACHMENT0,
					target.gl.TEXTURE_2D,
					target.texture,
					0
				);
				target.gl.viewport(target.x, target.y, target.width, target.height);
				target.gl.useProgram(program);
				target.gl.uniform1f(timeLocation, performance.now() / 1000);
				target.gl.drawArrays(target.gl.TRIANGLES, 0, 3);
			}
		},
		onRemove: destroy
	};
</script>

<MapLibre
	class="h-[55vh] min-h-75"
	style="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
	zoom={4}
	center={{ lng: 136.5, lat: 37.5 }}
>
	<Image id="gpu-signal" image={gpuImage} options={{ pixelRatio: 2 }} />
	<GeoJSONSource
		data={{
			type: 'FeatureCollection',
			features: CITIES.map((coordinates) => ({
				type: 'Feature' as const,
				geometry: { type: 'Point' as const, coordinates },
				properties: {}
			}))
		}}
	>
		<SymbolLayer layout={{ 'icon-image': 'gpu-signal', 'icon-allow-overlap': true }} />
	</GeoJSONSource>
</MapLibre>
