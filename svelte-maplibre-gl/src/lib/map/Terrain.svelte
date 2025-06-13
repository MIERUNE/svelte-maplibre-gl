<script lang="ts">
	// https://maplibre.org/maplibre-style-spec/terrain/

	import { onDestroy } from 'svelte';
	import maplibregl from 'maplibre-gl';
	import { getMapContext, getSourceContext } from '../contexts.svelte.js';

	interface Props extends Omit<maplibregl.TerrainSpecification, 'source'> {
		source?: string;
	}
	let { source, ...spec }: Props = $props();

	const mapCtx = getMapContext();
	if (!mapCtx.map) throw new Error('Map instance is not initialized.');

	// Get source id from source context or props
	const sourceId = $derived(source ?? getSourceContext().id);

	$effect(() => {
		mapCtx.userTerrain = $state.snapshot({ ...spec, source: sourceId });
		mapCtx.waitForStyleLoaded((map) => {
			map.setTerrain((mapCtx.userTerrain as maplibregl.TerrainSpecification) || null);
		});
	});

	onDestroy(() => {
		mapCtx.userTerrain = undefined;
		mapCtx.waitForStyleLoaded((map) => {
			map.setTerrain(mapCtx.baseTerrain ?? null);
		});
	});
</script>
