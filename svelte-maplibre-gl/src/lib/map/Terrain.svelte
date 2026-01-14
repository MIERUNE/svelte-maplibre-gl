<script lang="ts">
	// https://maplibre.org/maplibre-style-spec/terrain/

	import maplibregl from 'maplibre-gl';
	import { onDestroy } from 'svelte';
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
	let addingTerrain = false;
	const addTerrainAbortController = new AbortController();
	$effect(() => {
		mapCtx.userTerrain = $state.snapshot({ ...spec, source: sourceId });

		if (addingTerrain) {
			return;
		}

		addingTerrain = true;
		mapCtx.waitForSourceLoaded(
			sourceId,
			(map, error) => {
				if (error) {
					console.error(`Error adding terrain due to source load failure:`, error);
					addingTerrain = false;
					return;
				}

				map.setTerrain((mapCtx.userTerrain as maplibregl.TerrainSpecification) || null);
				firstRun = false;
				addingTerrain = false;
			},
			{ signal: addTerrainAbortController.signal }
		);
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
		addTerrainAbortController.abort();
	});
</script>
