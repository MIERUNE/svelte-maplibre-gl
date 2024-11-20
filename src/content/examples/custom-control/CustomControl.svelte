<script lang="ts">
	import { HillshadeLayer, MapLibre, RasterDEMTileSource, Terrain, CustomControl } from 'svelte-maplibre-gl';
	import maplibregl from 'maplibre-gl';
	import AttributionControl from '$lib/maplibre/controls/AttributionControl.svelte';

	let isHillshadeVisible = $state(true);
	let isTerrainVisible = $state(true);

	class MyControl implements maplibregl.IControl {
		private _container: HTMLElement | undefined;

		constructor() {}

		onAdd(_: maplibregl.Map) {
			this._container = document.createElement('div');
			this._container.className = 'maplibregl-ctrl maplibregl-ctrl-group p-2 rounded flex w-[240px] gap-x-2';

			const toggleTerrain = document.createElement('button');
			toggleTerrain.textContent = 'Disable Terrain';
			toggleTerrain.type = 'button';
			toggleTerrain.style.backgroundColor = 'red';
			toggleTerrain.style.width = '50%';
			toggleTerrain.style.height = '100%';
			toggleTerrain.style.borderRadius = '0.25rem';
			toggleTerrain.addEventListener('click', () => {
				isTerrainVisible = !isTerrainVisible;
				toggleTerrain.textContent = isTerrainVisible ? 'Disable Terrain' : 'Enable Terrain';
			});

			const toggleHillshade = document.createElement('button');
			toggleHillshade.textContent = 'Disable Hillshade';
			toggleHillshade.type = 'button';
			toggleHillshade.style.backgroundColor = 'blue';
			toggleHillshade.style.height = '100%';
			toggleHillshade.style.width = '50%';
			toggleHillshade.style.borderRadius = '0.25rem';
			toggleHillshade.addEventListener('click', () => {
				isHillshadeVisible = !isHillshadeVisible;
				toggleHillshade.textContent = isHillshadeVisible ? 'Disable Hillshade' : 'Enable Hillshade';
			});

			this._container.appendChild(toggleTerrain);
			this._container.appendChild(toggleHillshade);
			return this._container!;
		}

		onRemove() {
			if (this._container && this._container.parentNode) {
				this._container.parentNode.removeChild(this._container);
			}
		}
	}

	const myControl = new MyControl();
</script>

<MapLibre
	class="h-[60vh] min-h-[300px]"
	style="https://demotiles.maplibre.org/styles/osm-bright-gl-style/style.json"
	zoom={12}
	pitch={72}
	maxPitch={85}
	center={{ lng: 11.39085, lat: 47.3 }}
>
	<CustomControl position="top-left" control={myControl} />
	<AttributionControl />
	<RasterDEMTileSource
		id="terrain"
		tiles={['https://demotiles.maplibre.org/terrain-tiles/{z}/{x}/{y}.png']}
		minzoom={0}
		maxzoom={12}
		attribution="<a href='https://earth.jaxa.jp/en/data/policy/'>AW3D30 (JAXA)</a>"
	>
		{#if isTerrainVisible}
			<Terrain />
		{/if}
		{#if isHillshadeVisible}
			<HillshadeLayer />
		{/if}
	</RasterDEMTileSource>
</MapLibre>
