<script lang="ts">
	// https://maplibre.org/maplibre-style-spec/projection/

	import { onDestroy } from 'svelte';
	import maplibregl from 'maplibre-gl';
	import { getMapContext } from '../contexts.svelte.js';

	type Props = maplibregl.ProjectionSpecification;
	let { ...spec }: Props = $props();

	const mapCtx = getMapContext();
	if (!mapCtx.map) throw new Error('Map instance is not initialized.');

	$effect(() => {
		mapCtx.userProjection = $state.snapshot(spec) as maplibregl.ProjectionSpecification;
		if (!mapCtx.userProjection.type) {
			mapCtx.userProjection.type = 'mercator';
		}
		mapCtx.waitForStyleLoaded((map) => {
			map.setProjection(mapCtx.userProjection as maplibregl.ProjectionSpecification);
		});
	});

	onDestroy(() => {
		mapCtx.userProjection = undefined;
		mapCtx.waitForStyleLoaded((map) => {
			map.setProjection(mapCtx.baseProjection ?? { type: 'mercator' });
		});
	});
</script>
