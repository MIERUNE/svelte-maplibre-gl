<script lang="ts">
	import { MapLibre, CustomLayer, GlobeControl, Projection } from 'svelte-maplibre-gl';
	import maplibregl from 'maplibre-gl';
	import * as THREE from 'three';
	import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

	class CustomLayerImpl implements Omit<maplibregl.CustomLayerInterface, 'id' | 'type'> {
		renderingMode = '3d' as const;
		private camera = new THREE.Camera();
		private scene = new THREE.Scene();
		private renderer: THREE.WebGLRenderer | null = null;
		private map: maplibregl.Map | null = null;

		onAdd(map: maplibregl.Map, gl: WebGL2RenderingContext) {
			this.map = map;

			// Create two three.js lights to illuminate the model
			const directionalLight1 = new THREE.DirectionalLight(0xffffff);
			directionalLight1.position.set(0, -70, 100).normalize();
			this.scene.add(directionalLight1);

			const directionalLight2 = new THREE.DirectionalLight(0xffffff);
			directionalLight2.position.set(0, 70, 100).normalize();
			this.scene.add(directionalLight2);

			// Use the three.js GLTF loader to add the 3D model to the three.js scene
			const loader = new GLTFLoader();
			loader.load('https://maplibre.org/maplibre-gl-js/docs/assets/34M_17/34M_17.gltf', (gltf) => {
				this.scene.add(gltf.scene);
			});

			// Use the MapLibre GL JS map canvas for three.js
			this.renderer = new THREE.WebGLRenderer({
				canvas: map.getCanvas(),
				context: gl,
				antialias: true
			});
			this.renderer.autoClear = false;
		}

		render(_gl: WebGL2RenderingContext | WebGLRenderingContext, args: maplibregl.CustomRenderMethodInput) {
			const modelOrigin: [number, number] = [148.9819, -35.39847];
			const modelAltitude = 0;
			const scaling = 10_000.0;
			// We can use this API to get the correct model matrix.
			// It will work regardless of current projection.
			// See MapLibre source code, file "mercator_transform.ts" or "vertical_perspective_transform.ts".
			const modelMatrix = this.map!.transform.getMatrixForModel(modelOrigin, modelAltitude);
			const m = new THREE.Matrix4().fromArray(args.defaultProjectionData.mainMatrix);
			const l = new THREE.Matrix4().fromArray(modelMatrix).scale(new THREE.Vector3(scaling, scaling, scaling));

			this.camera.projectionMatrix = m.multiply(l);
			this.renderer!.resetState();
			this.renderer!.render(this.scene, this.camera);
			this.map!.triggerRepaint();
		}
	}

	const customLayerImpl = new CustomLayerImpl();
</script>

<MapLibre
	class="h-[55vh] min-h-[300px]"
	style="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
	zoom={5}
	pitch={50}
	maxPitch={80}
	center={[150.16546137527212, -35.017179237129994]}
>
	<CustomLayer implementation={customLayerImpl} />
	<GlobeControl />
	<Projection type="globe" />
</MapLibre>
