<script lang="ts">
	import 'svelte-maplibre-gl/vite';
	import { MapLibre } from 'svelte-maplibre-gl';
	import type { Map as MapLibreMap } from 'maplibre-gl';

	let map: MapLibreMap | undefined = $state();
	let globalState: Record<string, unknown> = $state({ removed: 'initial', kept: 'same', changed: 'before' });
	$effect(() => {
		if (map) (window as unknown as { __map: MapLibreMap }).__map = map;
	});
</script>

<button
	onclick={() => {
		globalState = { kept: 'same', changed: 'after', added: 'new' };
	}}>Update state</button
>
<output data-global-state>{JSON.stringify(globalState)}</output>
<MapLibre bind:map {globalState} style="/delayed-global-state-style.json" class="h-[200px] w-full" />
