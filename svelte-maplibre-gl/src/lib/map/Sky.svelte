<script lang="ts">
	// https://maplibre.org/maplibre-style-spec/sky/

	import { onDestroy } from 'svelte';
	import maplibregl from 'maplibre-gl';
	import { getMapContext } from '../contexts.svelte.js';

	let { ...spec }: maplibregl.SkySpecification = $props();

	const mapCtx = getMapContext();
	if (!mapCtx.map) throw new Error('Map instance is not initialized.');

	$effect(() => {
		mapCtx.userSky = $state.snapshot(spec) as maplibregl.SkySpecification;
		mapCtx.waitForStyleLoaded((map) => {
			map.setSky(mapCtx.userSky as maplibregl.SkySpecification);
		});
	});

	onDestroy(() => {
		mapCtx.userSky = undefined;
		mapCtx.waitForStyleLoaded((map) => {
			map.setSky(mapCtx.baseSky as maplibregl.SkySpecification);
		});
	});
</script>
