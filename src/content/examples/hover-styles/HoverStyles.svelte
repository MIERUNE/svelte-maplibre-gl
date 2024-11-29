<script lang="ts">
	import { FillLayer, LineLayer, MapLibre, GeoJSONSource, FeatureState } from 'svelte-maplibre-gl';
	let hoveredId: string | number | undefined = $state();
</script>

<MapLibre
	class="h-[55vh] min-h-[300px]"
	style="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
	zoom={2}
	center={{ lng: -100.486052, lat: 37.830348 }}
>
	<GeoJSONSource data="https://maplibre.org/maplibre-gl-js/docs/assets/us_states.geojson">
		<FillLayer
			paint={{
				'fill-color': '#00ff55',
				'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.4, 0.1]
			}}
			onmousemove={(ev) => (hoveredId = ev.features?.[0]?.id)}
			onmouseleave={() => (hoveredId = undefined)}
		/>
		<LineLayer
			paint={{
				'line-color': '#00ff55',
				'line-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 1, 0.3],
				'line-width': 1
			}}
		/>
		{#if hoveredId}
			<FeatureState id={hoveredId} state={{ hover: true }} />
		{/if}
	</GeoJSONSource>
</MapLibre>
