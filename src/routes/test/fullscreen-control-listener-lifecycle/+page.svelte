<script lang="ts">
	import 'svelte-maplibre-gl/vite';
	import type { StyleSpecification } from 'maplibre-gl';
	import { FullScreenControl, MapLibre } from 'svelte-maplibre-gl';

	let pseudo = $state(false);
	let starts = $state(0);
	let ends = $state(0);

	const style = {
		version: 8,
		sources: {},
		layers: [{ id: 'background', type: 'background', paint: { 'background-color': '#ffffff' } }]
	} satisfies StyleSpecification;
</script>

<button type="button" data-testid="recreate-fullscreen-control" onclick={() => (pseudo = true)}>
	Recreate fullscreen control
</button>

<MapLibre {style} class="h-[200px] w-full" zoom={1} center={{ lng: 0, lat: 0 }}>
	<FullScreenControl {pseudo} onfullscreenstart={() => starts++} onfullscreenend={() => ends++} />
</MapLibre>

<output data-testid="fullscreen-events">{starts}:{ends}</output>
