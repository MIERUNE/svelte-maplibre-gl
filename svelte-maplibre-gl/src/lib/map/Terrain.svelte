<script lang="ts">
	// https://maplibre.org/maplibre-style-spec/terrain/

	import { onDestroy, untrack } from 'svelte';
	import type * as maplibregl from 'maplibre-gl';
	import { getMapContext, getSourceContext } from '../contexts.svelte.js';

	interface Props extends Omit<maplibregl.TerrainSpecification, 'source'> {
		source?: string;
	}
	let { source, ...spec }: Props = $props();

	const mapCtx = getMapContext();
	if (!mapCtx.map) throw new Error('Map instance is not initialized.');

	// Get source id from source context or props
	const sourceId = $derived(source ?? getSourceContext().id);
	const getTerrain = () => $state.snapshot({ ...spec, source: sourceId }) as maplibregl.TerrainSpecification;

	let firstRun = true;
	mapCtx.userTerrain = untrack(getTerrain);
	queueMicrotask(() => {
		if (!firstRun) return;
		firstRun = false;
		mapCtx.waitForStyleLoaded((map) => {
			map.setTerrain((mapCtx.userTerrain as maplibregl.TerrainSpecification) || null);
		});
	});

	$effect(() => {
		mapCtx.userTerrain = getTerrain();
		if (!firstRun) {
			mapCtx.waitForStyleLoaded((map) => {
				map.setTerrain(mapCtx.userTerrain || null);
			});
		}
	});

	onDestroy(() => {
		// Suppress the queued microtask if it hasn't fired yet (rapid mount/unmount).
		firstRun = false;
		mapCtx.userTerrain = undefined;
		mapCtx.waitForStyleLoaded((map) => {
			map.setTerrain(mapCtx.baseTerrain ?? null);
		});
	});
</script>
