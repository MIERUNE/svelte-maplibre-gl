<script lang="ts">
	import { FillLayer, LineLayer, MapLibre, GeoJSONSource, FeatureState, Popup } from 'svelte-maplibre-gl';
	import type * as maplibregl from 'maplibre-gl';

	let hoveredFeature: maplibregl.MapGeoJSONFeature | undefined = $state.raw();
</script>

<MapLibre
	class="h-[55vh] min-h-75"
	style="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
	zoom={2}
	center={{ lng: -100.486052, lat: 37.830348 }}
>
	<GeoJSONSource data="https://maplibre.org/maplibre-gl-js/docs/assets/us_states.geojson">
		<FillLayer
			paint={{
				'fill-color': '#00ff55',
				// Change the opacity for the hovered feature
				'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.4, 0.1]
			}}
			onmousemove={(ev) => {
				// Listen to mousemove events to track the hovered feature
				hoveredFeature = ev.features?.[0];
			}}
			onmouseleave={() => (hoveredFeature = undefined)}
		/>
		<LineLayer
			paint={{
				'line-color': '#00ff55',
				// Change the opacity for the hovered feature
				'line-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 1, 0.3],
				'line-width': 1
			}}
		/>
		{#if hoveredFeature}
			<!-- Set the hover state on the source for the hovered feature -->
			<FeatureState id={hoveredFeature.id} state={{ hover: true }} />
			<Popup trackPointer closeButton={false}>{hoveredFeature.properties.STATE_NAME}</Popup>
		{/if}
	</GeoJSONSource>
</MapLibre>
