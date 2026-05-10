<script lang="ts">
	import type { StyleSpecification } from 'maplibre-gl';
	import { MapLibre, Popup } from 'svelte-maplibre-gl';

	let trackPointer = $state(true);

	const style = {
		version: 8,
		sources: {},
		layers: [{ id: 'background', type: 'background', paint: { 'background-color': '#ffffff' } }]
	} satisfies StyleSpecification;

	$effect(() => {
		(window as unknown as { __setTrackPointer: (next: boolean) => void }).__setTrackPointer = (next) => {
			trackPointer = next;
		};
	});
</script>

<MapLibre {style} class="h-[200px] w-full" zoom={1} center={{ lng: 0, lat: 0 }}>
	<Popup open={true} {trackPointer}>Popup</Popup>
</MapLibre>
