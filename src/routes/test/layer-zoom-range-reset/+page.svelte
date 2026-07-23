<script lang="ts">
	import type { Map as MapLibreMap, StyleSpecification } from 'maplibre-gl';
	import { CircleLayer, MapLibre } from 'svelte-maplibre-gl';

	let map: MapLibreMap | undefined = $state();
	let minzoom: number | undefined = $state(4);
	let maxzoom: number | undefined = $state(8);

	const points = {
		type: 'FeatureCollection' as const,
		features: [
			{
				type: 'Feature' as const,
				geometry: { type: 'Point' as const, coordinates: [0, 0] as [number, number] },
				properties: {}
			}
		]
	};

	const style = {
		version: 8,
		sources: {
			'zoom-range-points': {
				type: 'geojson',
				data: points
			}
		},
		layers: [{ id: 'background', type: 'background', paint: { 'background-color': '#ffffff' } }]
	} satisfies StyleSpecification;

	$effect(() => {
		if (!map) return;
		const win = window as unknown as {
			__map: MapLibreMap;
			__clearLayerZoomRange: () => void;
		};
		win.__map = map;
		win.__clearLayerZoomRange = () => {
			minzoom = undefined;
			maxzoom = undefined;
		};
	});
</script>

<MapLibre bind:map {style} class="h-[200px] w-full" zoom={1} center={{ lng: 0, lat: 0 }}>
	<CircleLayer source="zoom-range-points" id="zoom-range-layer" {minzoom} {maxzoom} paint={{ 'circle-radius': 4 }} />
</MapLibre>
