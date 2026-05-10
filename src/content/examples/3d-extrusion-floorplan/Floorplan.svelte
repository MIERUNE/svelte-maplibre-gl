<script lang="ts">
	import {
		MapLibre,
		RasterTileSource,
		BackgroundLayer,
		RasterLayer,
		GeoJSONSource,
		FillExtrusionLayer
	} from 'svelte-maplibre-gl';
</script>

<MapLibre class="h-[50vh] min-h-75" zoom={16.5} center={[-87.61694, 41.86625]} pitch={40} bearing={30}>
	<BackgroundLayer paint={{ 'background-color': '#e0dfdf' }} />
	<RasterTileSource tiles={['https://tile.openstreetmap.org/{z}/{x}/{y}.png']} tileSize={256} minzoom={0} maxzoom={19}>
		<RasterLayer />
	</RasterTileSource>
	<GeoJSONSource data="https://maplibre.org/maplibre-gl-js/docs/assets/indoor-3d-map.geojson">
		<FillExtrusionLayer
			paint={{
				// Get the fill-extrusion parameters from the source GeoJSON properties.
				//
				// See the MapLibre Style Specification for details on data expressions.
				// https://maplibre.org/maplibre-style-spec/expressions/
				'fill-extrusion-color': ['get', 'color'],
				'fill-extrusion-height': ['get', 'height'],
				'fill-extrusion-base': ['get', 'base_height'],
				'fill-extrusion-opacity': 0.5
			}}
		/>
	</GeoJSONSource>
</MapLibre>
