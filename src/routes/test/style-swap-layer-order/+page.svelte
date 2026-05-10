<script lang="ts">
	import type { Map as MapLibreMap, StyleSpecification } from 'maplibre-gl';
	import { CircleLayer, GeoJSONSource, MapLibre } from 'svelte-maplibre-gl';

	let map: MapLibreMap | undefined = $state();
	let variant = $state<'a' | 'b'>('a');

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

	const styleA = {
		version: 8,
		sources: {},
		layers: [
			{ id: 'base-a-bottom', type: 'background', paint: { 'background-opacity': 0 } },
			{ id: 'anchor-a', type: 'background', paint: { 'background-opacity': 0 } },
			{ id: 'base-a-middle', type: 'background', paint: { 'background-opacity': 0 } },
			{ id: 'anchor-b', type: 'background', paint: { 'background-opacity': 0 } },
			{ id: 'base-a-top', type: 'background', paint: { 'background-opacity': 0 } }
		]
	} satisfies StyleSpecification;

	const styleB = {
		version: 8,
		sources: {},
		layers: [
			{ id: 'base-b-top', type: 'background', paint: { 'background-opacity': 0 } },
			{ id: 'anchor-b', type: 'background', paint: { 'background-opacity': 0 } },
			{ id: 'base-b-middle', type: 'background', paint: { 'background-opacity': 0 } },
			{ id: 'anchor-a', type: 'background', paint: { 'background-opacity': 0 } },
			{ id: 'base-b-bottom', type: 'background', paint: { 'background-opacity': 0 } }
		]
	} satisfies StyleSpecification;

	const style = $derived(variant === 'a' ? styleA : styleB);

	$effect(() => {
		if (!map) return;
		const win = window as unknown as {
			__map: MapLibreMap;
			__setStyleVariant: (next: 'a' | 'b') => void;
		};
		win.__map = map;
		win.__setStyleVariant = (next) => {
			variant = next;
		};
	});
</script>

<MapLibre bind:map {style} class="h-[200px] w-full" zoom={1} center={{ lng: 0, lat: 0 }}>
	<GeoJSONSource id="swap-points" data={points}>
		<CircleLayer id="user-before-a" beforeId="anchor-a" paint={{ 'circle-radius': 4 }} />
		<CircleLayer id="user-before-b" beforeId="anchor-b" paint={{ 'circle-radius': 4 }} />
	</GeoJSONSource>
</MapLibre>
