<script lang="ts">
	// E2E fixture for #137: source/layer inside a {#key} block must survive
	// repeated re-renders without colliding with the previous mount. Uses an
	// empty inline style so the test does not depend on network tile fetches.
	import { CircleLayer, GeoJSONSource, MapLibre } from 'svelte-maplibre-gl';

	let renderKey = $state(0);

	const emptyStyle = {
		version: 8 as const,
		sources: {},
		layers: []
	};

	const data = {
		type: 'FeatureCollection' as const,
		features: [
			{
				type: 'Feature' as const,
				geometry: { type: 'Point' as const, coordinates: [0, 0] as [number, number] },
				properties: {}
			}
		]
	};
</script>

<button data-testid="rerender" onclick={() => renderKey++}>Re-render ({renderKey})</button>

<MapLibre style={emptyStyle} class="h-[200px] w-full" zoom={1} center={{ lng: 0, lat: 0 }}>
	{#key renderKey}
		<GeoJSONSource id="source-1" {data}>
			<CircleLayer id="circle-1" paint={{ 'circle-radius': 4, 'circle-color': '#f00' }} />
		</GeoJSONSource>
	{/key}
</MapLibre>
