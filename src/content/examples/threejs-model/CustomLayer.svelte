<script lang="ts">
	import { MapLibre, CustomLayer } from 'svelte-maplibre-gl';
	import maplibregl from 'maplibre-gl';
	import * as THREE from 'three';
	import { Matrix4, Vector3 } from 'three';
	import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

	let map: maplibregl.Map | undefined = $state.raw();

	const modelOrigin: [number, number] = [148.9819, -35.39847];
	const modelAltitude = 0;
	const modelRotate = [Math.PI / 2, 0, 0];
	const modelAsMercatorCoordinate = maplibregl.MercatorCoordinate.fromLngLat(modelOrigin, modelAltitude);

	class CustomLayerImpl implements Omit<maplibregl.CustomLayerInterface, 'id' | 'type'> {
		camera = new THREE.Camera();
		scene = new THREE.Scene();
		renderer: THREE.WebGLRenderer | null = null;

		renderingMode = '3d' as const;

		onAdd(map: maplibregl.Map, gl: WebGL2RenderingContext) {
			// create two three.js lights
			const directionalLight1 = new THREE.DirectionalLight(0xffffff);
			directionalLight1.position.set(0, -70, 100).normalize();
			this.scene.add(directionalLight1);

			const directionalLight2 = new THREE.DirectionalLight(0xffffff);
			directionalLight2.position.set(0, 70, 100).normalize();
			this.scene.add(directionalLight2);

			// load a glTF model
			const loader = new GLTFLoader();
			loader.load('https://maplibre.org/maplibre-gl-js/docs/assets/34M_17/34M_17.gltf', (gltf) => {
				this.scene.add(gltf.scene);
			});

			// use the MapLibre GL JS map canvas for three.js
			this.renderer = new THREE.WebGLRenderer({
				canvas: map!.getCanvas(),
				context: gl,
				antialias: true
			});

			this.renderer.autoClear = false;
		}

		render(_gl: WebGL2RenderingContext | WebGLRenderingContext, options: maplibregl.CustomRenderMethodInput) {
			const scale = modelAsMercatorCoordinate.meterInMercatorCoordinateUnits();
			const world = new Matrix4().fromArray(options.defaultProjectionData.mainMatrix);
			const local = new Matrix4()
				.makeTranslation(modelAsMercatorCoordinate.x, modelAsMercatorCoordinate.y, modelAsMercatorCoordinate.z)
				.scale(new Vector3(scale, -scale, scale))
				.multiply(new Matrix4().makeRotationX(modelRotate[0]))
				.multiply(new Matrix4().makeRotationY(modelRotate[1]))
				.multiply(new Matrix4().makeRotationZ(modelRotate[2]));

			this.camera.projectionMatrix = world.multiply(local);
			this.renderer!.resetState();
			this.renderer!.render(this.scene, this.camera);
			map!.triggerRepaint();
		}
	}

	const customLayerImpl = new CustomLayerImpl();
</script>

<MapLibre
	bind:map
	class="h-[55vh] min-h-[300px]"
	style="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
	zoom={18}
	pitch={60}
	center={[148.9819, -35.3981]}
>
	<CustomLayer implementation={customLayerImpl} />
</MapLibre>
