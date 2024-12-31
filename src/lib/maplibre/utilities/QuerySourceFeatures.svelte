<script lang="ts">
	import { onDestroy, type Snippet } from 'svelte';
	import maplibregl from 'maplibre-gl';
	import { getMapContext, getSourceContext } from '../contexts.svelte.js';

	interface Props extends maplibregl.QuerySourceFeatureOptions {
		map?: maplibregl.Map;
		source?: string;
		features?: maplibregl.MapGeoJSONFeature[];
		children?: Snippet<[maplibregl.MapGeoJSONFeature]>;
	}

	let { map: givenMap, source: givenSource, features = $bindable([]), children, ...options }: Props = $props();

	features = [];
	let trigger = $state(0);
	let map = $derived(givenMap || getMapContext().map);
	let source = $derived(givenSource || getSourceContext().id);

	$effect(() => {
		map?.on('render', update);
		return () => {
			map?.off('render', update);
		};
	});

	function update() {
		trigger++;
	}

	$effect(() => {
		trigger;
		if (!map || !source) {
			features = [];
			return;
		}

		let queriedFeature = map.querySourceFeatures(
			source,
			$state.snapshot(options) as maplibregl.QuerySourceFeatureOptions
		) as maplibregl.MapGeoJSONFeature[];

		// deduplicate
		let closed = new Set();
		queriedFeature = queriedFeature.filter((feature) => {
			if (feature.id !== undefined) {
				if (closed.has(feature.id)) {
					return false;
				}
			}
			closed.add(feature.id);
			return true;
		});

		// sort
		queriedFeature.sort((a, b) => {
			return String(a.id).localeCompare(String(b.id));
		});

		features = queriedFeature;
	});

	onDestroy(() => {
		features = [];
	});
</script>

{#if children}{#each features as feature (feature.id)}{@render children(feature)}{/each}{/if}
