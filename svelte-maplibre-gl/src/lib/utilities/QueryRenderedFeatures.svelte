<script lang="ts">
	import { onDestroy, type Snippet } from 'svelte';
	import maplibregl from 'maplibre-gl';
	import { getLayerContext, getMapContext } from '../contexts.svelte.js';

	interface Props extends maplibregl.QueryRenderedFeaturesOptions {
		map?: maplibregl.Map;
		geometry?: maplibregl.PointLike | [maplibregl.PointLike, maplibregl.PointLike];
		features?: maplibregl.MapGeoJSONFeature[];
		children?: Snippet<[maplibregl.MapGeoJSONFeature]>;
	}

	let { map: givenMap, geometry, features = $bindable([]), children, layers, ...options }: Props = $props();

	features = [];
	let trigger = $state(0);
	let map = $derived(givenMap || getMapContext().map);

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
		if (!map) {
			features = [];
			return;
		}

		let _options = {
			layers: layers || [getLayerContext()?.id || ''],
			...options
		};
		let _geometry = geometry;
		let queriedFeatures = _geometry
			? map.queryRenderedFeatures(_geometry, _options)
			: map.queryRenderedFeatures(_options)
			// id may be undefined - fallback to properties.id or generate one
			.map((feature, index) => {
				feature.id = feature.id ?? feature.properties?.id ?? `svmlgl-feature-${index}`;
				return feature;
			});

		// sort
		queriedFeatures.sort((a, b) => {
			return String(a.id).localeCompare(String(b.id));
		});

		features = queriedFeatures;
	});

	onDestroy(() => {
		features = [];
	});
</script>

{#if children}{#each features as feature (feature.id)}{@render children(feature)}{/each}{/if}
