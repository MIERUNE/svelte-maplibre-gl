<script lang="ts">
	import {
		HillshadeLayer,
		MapLibre,
		RasterDEMTileSource,
		LineLayer,
		SymbolLayer,
		TerrainControl
	} from 'svelte-maplibre-gl';
	import { MapLibreContourSource } from 'svelte-maplibre-gl/contour';
</script>

<MapLibre
	class="h-[55vh] min-h-[300px]"
	style="https://demotiles.maplibre.org/styles/osm-bright-gl-style/style.json"
	zoom={12}
	minZoom={10}
	center={{ lng: 11.35, lat: 47.3 }}
>
	<MapLibreContourSource
		url={'https://demotiles.maplibre.org/terrain-tiles/{z}/{x}/{y}.png'}
		maxzoom={12}
		tileOptions={{
			// multiplier: 1,
			thresholds: {
				// zoom: [minor, major]
				11: [100, 500],
				12: [50, 200],
				13: [20, 100],
				14: [10, 50]
			},
			// optional, override vector tile parameters:
			contourLayer: 'contours',
			elevationKey: 'ele',
			levelKey: 'level'
		}}
		attribution="<a href='https://earth.jaxa.jp/en/data/policy/'>AW3D30 (JAXA)</a>"
	>
		{#snippet children(demSource)}
			<RasterDEMTileSource tiles={[demSource.sharedDemProtocolUrl]} maxzoom={12} tileSize={256}>
				<TerrainControl />
			</RasterDEMTileSource>
			<RasterDEMTileSource tiles={[demSource.sharedDemProtocolUrl]} maxzoom={12} tileSize={256}>
				<HillshadeLayer
					paint={{
						'hillshade-exaggeration': 0.5,
						'hillshade-illumination-anchor': 'map',
						'hillshade-shadow-color': '#3080b0'
					}}
				/>
			</RasterDEMTileSource>
			<LineLayer
				sourceLayer="contours"
				paint={{
					'line-color': 'rgba(90, 20, 0, 1)',
					'line-width': ['match', ['get', 'level'], 1, 1.5, 0.5]
				}}
			/>
			<SymbolLayer
				sourceLayer="contours"
				filter={['>', ['get', 'level'], 0]}
				layout={{
					'symbol-placement': 'line',
					'text-size': 12,
					'text-field': ['number-format', ['get', 'ele'], {}]
				}}
				paint={{
					'text-halo-color': 'white',
					'text-halo-width': 1
				}}
			/>
		{/snippet}
	</MapLibreContourSource>
</MapLibre>
