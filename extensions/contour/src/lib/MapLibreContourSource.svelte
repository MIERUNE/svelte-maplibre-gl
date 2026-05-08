<script lang="ts">
	// https://github.com/onthegomap/maplibre-contour

	import type { Snippet } from 'svelte';
	import * as maplibregl from 'maplibre-gl';
	import { default as mlcontour } from 'maplibre-contour';
	import { VectorTileSource } from 'svelte-maplibre-gl';

	type LocalDemManager = typeof mlcontour.LocalDemManager.prototype;
	type DemSource = typeof mlcontour.DemSource.prototype;
	type DemSourceConstructorParams = ConstructorParameters<typeof mlcontour.DemSource>[0];
	type GlobalContourTileOptions = Parameters<DemSource['contourProtocolUrl']>[0];

	interface Props extends DemSourceConstructorParams {
		children?: Snippet<[demSource: DemSource]>;
		demSource?: DemSource;
		tileOptions: GlobalContourTileOptions;
		attribution?: string;
		getTile?: LocalDemManager['getTile'];
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
		attribution,
		/** Custom getTile function for LocalDemManager (experimental) */
		getTile
	}: Props = $props();

	$effect(() => {
		const source = new mlcontour.DemSource({
			url,
			id,
			cacheSize, // number of most-recent tiles to cache
			encoding,
			maxzoom,
			timeoutMs, // timeout on fetch requests
			worker: getTile ? false : worker, // offload isoline computation to a web worker to reduce jank
			actor
		});
		if (getTile && 'getTile' in source.manager) {
			source.manager.getTile = getTile;
		}
		source.setupMaplibre(maplibregl);
		demSource = source;

		return () => {
			maplibregl.removeProtocol(source.sharedDemProtocolId);
			maplibregl.removeProtocol(source.contourProtocolId);
		};
	});
</script>

{#if demSource}
	<VectorTileSource tiles={[demSource.contourProtocolUrl(tileOptions)]} maxzoom={15} {attribution}>
		{@render children?.(demSource)}
	</VectorTileSource>
{/if}
