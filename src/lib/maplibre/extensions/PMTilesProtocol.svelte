<script lang="ts">
	import { Protocol as MapLibreProtocol } from 'svelte-maplibre-gl';
	import { Protocol } from 'pmtiles';

	let { scheme = 'pmtiles' }: { scheme?: string } = $props();
	const protocol = new Protocol();
</script>

<MapLibreProtocol {scheme} loadFn={protocol.tile} />
