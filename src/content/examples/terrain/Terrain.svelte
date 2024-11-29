<script lang="ts">
	import { HillshadeLayer, MapLibre, RasterDEMTileSource, Sky, Terrain } from 'svelte-maplibre-gl';
	import { Slider } from '$lib/components/ui/slider/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	let hillshade = $state([0.5]);
	let terrain = $state([1.0]);
</script>

<div class="mb-4 flex items-center justify-between gap-x-10">
	<div class="flex flex-1 grow flex-col gap-y-4">
		<Label for="hillshade">Hillshade Exaggeration: {hillshade[0].toFixed(2)}</Label>
		<Slider id="hillshade" bind:value={hillshade} min={0} max={1} step={0.01} />
	</div>
	<div class="flex flex-1 grow flex-col gap-y-4">
		<Label for="terrain">Terrain Exaggeration: {terrain[0].toFixed(2)}</Label>
		<Slider id="terrain" bind:value={terrain} min={0} max={2} step={0.01} />
	</div>
</div>

<MapLibre
	class="h-[55vh] min-h-[300px]"
	style="https://demotiles.maplibre.org/styles/osm-bright-gl-style/style.json"
	zoom={12}
	pitch={72}
	maxPitch={85}
	center={{ lng: 11.39085, lat: 47.3 }}
>
	<Sky
		sky-color="#001560"
		horizon-color="#0090c0"
		fog-color="#ffffff"
		sky-horizon-blend={0.9}
		horizon-fog-blend={0.7}
		fog-ground-blend={0.6}
	/>
	<RasterDEMTileSource
		tiles={['https://demotiles.maplibre.org/terrain-tiles/{z}/{x}/{y}.png']}
		minzoom={0}
		maxzoom={12}
		attribution="<a href='https://earth.jaxa.jp/en/data/policy/'>AW3D30 (JAXA)</a>"
	>
		<Terrain exaggeration={terrain[0]} />
	</RasterDEMTileSource>
	<RasterDEMTileSource
		tiles={['https://demotiles.maplibre.org/terrain-tiles/{z}/{x}/{y}.png']}
		minzoom={0}
		maxzoom={12}
		attribution="<a href='https://earth.jaxa.jp/en/data/policy/'>AW3D30 (JAXA)</a>"
	>
		<HillshadeLayer
			paint={{
				'hillshade-exaggeration': hillshade[0],
				'hillshade-illumination-anchor': 'map',
				'hillshade-shadow-color': '#004050'
			}}
		/>
	</RasterDEMTileSource>
</MapLibre>
