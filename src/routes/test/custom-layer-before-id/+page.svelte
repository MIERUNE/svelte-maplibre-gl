<script lang="ts">
	import type { CustomLayerInterface, Map as MapLibreMap, StyleSpecification } from 'maplibre-gl';
	import { CustomLayer, MapLibre } from 'svelte-maplibre-gl';

	let map: MapLibreMap | undefined = $state();
	let beforeId: string | undefined = $state('anchor-a');

	const style = {
		version: 8,
		sources: {},
		layers: [
			{ id: 'base-bottom', type: 'background', paint: { 'background-opacity': 0 } },
			{ id: 'anchor-a', type: 'background', paint: { 'background-opacity': 0 } },
			{ id: 'base-middle', type: 'background', paint: { 'background-opacity': 0 } },
			{ id: 'anchor-b', type: 'background', paint: { 'background-opacity': 0 } },
			{ id: 'base-top', type: 'background', paint: { 'background-opacity': 0 } }
		]
	} satisfies StyleSpecification;

	const implementation = {
		render() {}
	} satisfies Omit<CustomLayerInterface, 'id' | 'type'>;

	$effect(() => {
		if (!map) return;
		const win = window as unknown as {
			__map: MapLibreMap;
			__setCustomLayerBeforeId: (next: string | undefined) => void;
		};
		win.__map = map;
		win.__setCustomLayerBeforeId = (next) => {
			beforeId = next;
		};
	});
</script>

<MapLibre bind:map {style} class="h-[200px] w-full" zoom={1} center={{ lng: 0, lat: 0 }}>
	<CustomLayer id="custom" {implementation} {beforeId} />
</MapLibre>
