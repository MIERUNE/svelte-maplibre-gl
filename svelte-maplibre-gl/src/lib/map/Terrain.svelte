<script lang="ts">
	// https://maplibre.org/maplibre-style-spec/terrain/

	import { onDestroy } from 'svelte';
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

	let firstRun = true;
	$effect(() => {
		mapCtx.userTerrain = $state.snapshot({ ...spec, source: sourceId });

		if (!firstRun) return;

		// User-added sources arrive reactively via the SvelteSet.
		if (mapCtx.userSources.has(sourceId)) {
			firstRun = false;
			mapCtx.waitForStyleLoaded((map) => {
				map.setTerrain((mapCtx.userTerrain as maplibregl.TerrainSpecification) || null);
			});
			return;
		}

		// Source might be from the base style — verify after style load.
		mapCtx.waitForStyleLoaded((map) => {
			if (firstRun && map.getSource(sourceId)) {
				firstRun = false;
				map.setTerrain((mapCtx.userTerrain as maplibregl.TerrainSpecification) || null);
			}
		});
	});

	$effect(() => {
		spec.exaggeration;
		if (!firstRun) {
			mapCtx.userTerrain = $state.snapshot({ ...spec, source: sourceId });
			mapCtx.waitForStyleLoaded((map) => {
				map.setTerrain(mapCtx.userTerrain || null);
			});
		}
	});

	onDestroy(() => {
		mapCtx.userTerrain = undefined;
		mapCtx.waitForStyleLoaded((map) => {
			map.setTerrain(mapCtx.baseTerrain ?? null);
		});
	});
</script>
