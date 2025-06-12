<script lang="ts">
	// https://maplibre.org/maplibre-gl-js/docs/API/classes/Hash/

	// FIXME: SvelteKit interoperability

	import { onDestroy } from 'svelte';
	import maplibregl from 'maplibre-gl';
	import { getMapContext } from '../contexts.svelte.js';

	// let {}: {} = $props();

	const mapCtx = getMapContext();
	if (!mapCtx.map) throw new Error('Map instance is not initialized.');

	let hash = new maplibregl.Hash().addTo(mapCtx.map);
	if (!hash._onHashChange()) {
		hash._updateHash();
	}

	onDestroy(() => {
		hash.remove();
	});
</script>
