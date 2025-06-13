<script lang="ts">
	// https://maplibre.org/maplibre-style-spec/light/

	import { onDestroy } from 'svelte';
	import maplibregl from 'maplibre-gl';
	import { getMapContext } from '../contexts.svelte.js';

	let { ...spec }: maplibregl.LightSpecification = $props();

	const mapCtx = getMapContext();
	if (!mapCtx.map) throw new Error('Map instance is not initialized.');

	$effect(() => {
		mapCtx.userLight = $state.snapshot(spec) as maplibregl.LightSpecification;
		mapCtx.waitForStyleLoaded((map) => {
			map.setLight(mapCtx.userLight as maplibregl.LightSpecification);
		});
	});

	onDestroy(() => {
		mapCtx.userLight = undefined;
		mapCtx.waitForStyleLoaded((map) => {
			map.setLight(mapCtx.baseLight ?? {});
		});
	});
</script>
