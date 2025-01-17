<script lang="ts">
	import {
		HillshadeLayer,
		Light,
		LineLayer,
		MapLibre,
		Projection,
		ImageLoader,
		RasterDEMTileSource,
		Sky,
		Terrain,
		GeoJSONSource,
		SymbolLayer,
		VectorTileSource
	} from 'svelte-maplibre-gl';

	import { Label } from '$lib/components/ui/label/index.js';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import type { FeatureCollection } from 'geojson';

	// Base styles
	const STYLES = new Map<string, string | maplibregl.StyleSpecification>([
		['Voyager', 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json'],
		['Positron', 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'],
		['Dark Matter', 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'],
		['Demo Tiles', 'https://demotiles.maplibre.org/style.json'],
		[
			'GSI Seamlessphoto',
			{
				version: 8,
				sources: {
					basemap: {
						type: 'raster',
						tiles: ['https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg'],
						tileSize: 256,
						minzoom: 2,
						maxzoom: 18,
						attribution:
							"<a href='https://maps.gsi.go.jp/development/ichiran.html#seamlessphoto' target='_blank'>GSI, TSIC, AIST, NASA, USGS, GEBCO</a>"
					}
				},
				layers: [{ id: 'basemap', type: 'raster', source: 'basemap' }]
			} satisfies maplibregl.StyleSpecification
		],
		[
			'GSI Standard',
			{
				version: 8,
				sources: {
					basemap: {
						type: 'raster',
						tiles: ['https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png'],
						tileSize: 256,
						minzoom: 5,
						maxzoom: 18,
						attribution: "<a href='https://maps.gsi.go.jp/development/ichiran.html#std' target='_blank'>GSI</a>"
					}
				},
				layers: [{ id: 'basemap', type: 'raster', source: 'basemap' }]
			}
		]
	]);
	let name = $state('Voyager');
	let style = $derived(STYLES.get(name)!);
	let globe = $state(true);

	let data: FeatureCollection = {
		type: 'FeatureCollection',
		features: [
			{
				type: 'Feature',
				geometry: { type: 'Point', coordinates: [140, 30] },
				properties: { imageName: 'osgeo', year: 2024 }
			}
		]
	};
</script>

<div class="mb-3 flex items-center justify-between">
	<RadioGroup.Root bind:value={name} class="flex flex-row gap-x-3">
		{#each STYLES as [name, _]}
			<div class="flex items-center space-x-1">
				<RadioGroup.Item value={name} id={name} />
				<Label class="cursor-pointer" for={name}>{name}</Label>
			</div>
		{/each}
	</RadioGroup.Root>

	<div class="flex items-center space-x-2">
		<Switch id="globe" bind:checked={globe} />
		<Label for="globe">Globe</Label>
	</div>
</div>

<MapLibre class="h-[55vh] min-h-[300px]" {style} zoom={4} maxPitch={80} center={{ lng: 137, lat: 36 }}>
	<!-- User-defined dynamic styles -->
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
	<ImageLoader
		images={{
			osgeo: 'https://maplibre.org/maplibre-gl-js/docs/assets/osgeo-logo.png'
		}}
	>
		<GeoJSONSource {data}>
			<!-- Children components will be added after all images have been loaded -->
			<SymbolLayer
				layout={{
					'text-field': ['get', 'name'],
					'icon-image': ['get', 'imageName'],
					'icon-size': ['number', ['get', 'scale'], 1],
					'icon-text-fit': 'both',
					'icon-overlap': 'always',
					'text-overlap': 'always'
				}}
			/>
		</GeoJSONSource>
	</ImageLoader>
</MapLibre>
