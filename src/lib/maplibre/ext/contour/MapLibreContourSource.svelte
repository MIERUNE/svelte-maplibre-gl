<script lang="ts">
	// https://github.com/onthegomap/maplibre-contour

	import type { Snippet } from 'svelte';
	import maplibregl from 'maplibre-gl';
	import type mlcontour from 'maplibre-contour';

	import VectorTileSource from '$lib/maplibre/sources/VectorTileSource.svelte';

	type DemSource = typeof mlcontour.DemSource.prototype;
	type DemSourceConstructorParams = ConstructorParameters<typeof mlcontour.DemSource>[0];
	type GlobalContourTileOptions = Parameters<DemSource['contourProtocolUrl']>[0];

	interface Props extends DemSourceConstructorParams {
		children?: Snippet<[demSource: DemSource]>;
		demSource?: DemSource;
		tileOptions: GlobalContourTileOptions;
		attribution?: string;
	}

	let {
		children,
		demSource = $bindable(),
		url,
		id,
		cacheSize,
		encoding = 'mapbox',
		maxzoom,
		timeoutMs,
		worker = true,
		actor,
		tileOptions,
		attribution
	}: Props = $props();

	$effect(() => {
		(async () => {
			const mlcontour = (
				await import('maplibre-contour').catch((reason) => {
					throw new Error('Failed to load maplibre-contour', reason);
				})
			).default;
			demSource = new mlcontour.DemSource({
				url,
				id,
				cacheSize, // number of most-recent tiles to cache
				encoding,
				maxzoom,
				timeoutMs, // timeout on fetch requests
				worker, // offload isoline computation to a web worker to reduce jank
				actor
			});
			demSource.setupMaplibre(maplibregl);
		})();

		return () => {
			if (demSource) {
				maplibregl.removeProtocol(demSource.sharedDemProtocolId);
				maplibregl.removeProtocol(demSource.contourProtocolId);
			}
		};
	});
</script>

{#if demSource}
	<VectorTileSource tiles={[demSource.contourProtocolUrl(tileOptions)]} maxzoom={15} {attribution}>
		{@render children?.(demSource)}
	</VectorTileSource>
{/if}
