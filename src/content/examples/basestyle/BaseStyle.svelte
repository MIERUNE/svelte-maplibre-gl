<script lang="ts">
	import {
		HillshadeLayer,
		Light,
		LineLayer,
		MapLibre,
		Projection,
		RasterDEMTileSource,
		Sky,
		Terrain,
		VectorTileSource
	} from 'svelte-maplibre-gl';

	import { Label } from '$lib/components/ui/label/index.js';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';

	const STYLES = [
		{ name: 'Voyager', url: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json' },
		{ name: 'Positron', url: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json' },
		{ name: 'Dark Matter', url: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json' },
		{ name: 'Demo Tiles', url: 'https://demotiles.maplibre.org/style.json' }
	];
	let styleUrl = $state(STYLES[0].url);
	let globe = $state(true);
</script>

<div class="mb-3 flex items-center justify-between">
	<RadioGroup.Root bind:value={styleUrl} class="flex flex-row gap-x-3">
		{#each STYLES as style}
			<div class="flex items-center space-x-1">
				<RadioGroup.Item value={style.url} id={style.name} />
				<Label for={style.name}>{style.name}</Label>
			</div>
		{/each}
	</RadioGroup.Root>

	<div class="flex items-center space-x-2">
		<Switch id="globe" bind:checked={globe} />
		<Label for="globe">Globe</Label>
	</div>
</div>

<MapLibre class="h-[60vh] min-h-[300px]" style={styleUrl} zoom={4} maxPitch={80} center={{ lng: 137, lat: 36 }}>
	<Projection type={globe ? 'globe' : undefined} />
	<Light anchor="map" />
	<Sky
		sky-color="#001560"
		horizon-color="#0090c0"
		fog-color="#ffffff"
		sky-horizon-blend={0.9}
		horizon-fog-blend={0.7}
		fog-ground-blend={0.6}
		atmosphere-blend={['interpolate', ['linear'], ['zoom'], 1, 0.6, 3, 0.3, 5, 0]}
	/>
	<VectorTileSource
		tiles={['https://jma-assets.mierune.dev/tiles/mete/{z}/{x}/{y}.pbf']}
		minzoom={0}
		maxzoom={13}
		attribution={'<a href="https://www.data.jma.go.jp/developer/gis.html">JMA</a>'}
	>
		<LineLayer
			sourceLayer="city"
			layout={{ 'line-join': 'round', 'line-cap': 'round' }}
			paint={{ 'line-color': '#ff00ff', 'line-width': 1 }}
		/>
	</VectorTileSource>
	<RasterDEMTileSource
		tiles={['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png']}
		minzoom={0}
		maxzoom={15}
		encoding="terrarium"
		attribution="<a href='https://github.com/tilezen/joerd/blob/master/docs/attribution.md'>Mapzen (Terrain)</a>"
	>
		<HillshadeLayer paint={{ 'hillshade-exaggeration': 0.2 }} />
	</RasterDEMTileSource>
	{#if !globe}
		<RasterDEMTileSource
			id="terrain"
			tiles={['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png']}
			minzoom={0}
			maxzoom={15}
			encoding="terrarium"
			attribution="<a href='https://github.com/tilezen/joerd/blob/master/docs/attribution.md'>Mapzen (Terrain)</a>"
		>
			<Terrain />
		</RasterDEMTileSource>
	{/if}
</MapLibre>
