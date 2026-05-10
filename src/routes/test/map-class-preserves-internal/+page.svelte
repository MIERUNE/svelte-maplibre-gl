<script lang="ts">
	import type { StyleSpecification } from 'maplibre-gl';
	import { MapLibre } from 'svelte-maplibre-gl';

	let className = $state('initial-map h-[200px] w-full');

	const style = {
		version: 8,
		sources: {},
		layers: [{ id: 'background', type: 'background', paint: { 'background-color': '#ffffff' } }]
	} satisfies StyleSpecification;

	$effect(() => {
		(window as unknown as { __setMapClass: (next: string) => void }).__setMapClass = (next) => {
			className = next;
		};
	});
</script>

<MapLibre {style} class={className} zoom={1} center={{ lng: 0, lat: 0 }} />
