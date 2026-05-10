<script lang="ts">
	import type { PointLike, StyleSpecification } from 'maplibre-gl';
	import { MapLibre, Marker } from 'svelte-maplibre-gl';

	let offset: PointLike | undefined = $state();

	const style = {
		version: 8,
		sources: {},
		layers: [{ id: 'background', type: 'background', paint: { 'background-color': '#ffffff' } }]
	} satisfies StyleSpecification;

	$effect(() => {
		(window as unknown as { __setMarkerOffset: (next: PointLike | undefined) => void }).__setMarkerOffset = (next) => {
			offset = next;
		};
	});
</script>

<MapLibre {style} class="h-[200px] w-full" zoom={1} center={{ lng: 0, lat: 0 }}>
	<Marker lnglat={{ lng: 0, lat: 0 }} {offset} class="offset-marker">
		{#snippet content()}
			<div class="h-4 w-4 bg-red-500"></div>
		{/snippet}
	</Marker>
</MapLibre>
