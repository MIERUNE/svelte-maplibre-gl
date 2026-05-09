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
		// Wait reactively for the source to be registered (see RawLayer for
		// the same pattern). Sources from the base style are already in the
		// map's style, so they pass the second branch immediately.
		if (!mapCtx.userSources.has(sourceId) && !mapCtx.map?.getSource(sourceId)) return;

		mapCtx.waitForStyleLoaded((map) => {
			map.setTerrain((mapCtx.userTerrain as maplibregl.TerrainSpecification) || null);
		});
		firstRun = false;
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
