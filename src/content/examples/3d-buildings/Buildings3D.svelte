<script lang="ts">
	import { MapLibre, FillExtrusionLayer } from 'svelte-maplibre-gl';
</script>

<MapLibre
	class="h-[55vh] min-h-[300px]"
	style="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
	zoom={14.5}
	pitch={70}
	minZoom={14}
	bearing={0}
	center={[-74.01, 40.7075]}
>
	<FillExtrusionLayer
		source="carto"
		sourceLayer="building"
		minzoom={14}
		filter={['!=', ['get', 'hide_3d'], true]}
		paint={{
			'fill-extrusion-color': [
				'interpolate',
				['linear'],
				['get', 'render_height'],
				0,
				'#aaccbb',
				200,
				'royalblue',
				400,
				'purple'
			],
			'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 14, 0, 15, ['get', 'render_height']],
			'fill-extrusion-base': ['case', ['>=', ['get', 'zoom'], 14], ['get', 'render_min_height'], 0]
		}}
	/>
</MapLibre>
