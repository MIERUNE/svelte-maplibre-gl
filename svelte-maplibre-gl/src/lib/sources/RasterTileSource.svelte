<script lang="ts">
	// https://maplibre.org/maplibre-gl-js/docs/API/classes/RasterTileSource/
	// https://maplibre.org/maplibre-style-spec/sources/#raster

	import type { Snippet } from 'svelte';
	import maplibregl from 'maplibre-gl';
	import RawSource from './RawSource.svelte';

	interface Props extends Omit<maplibregl.RasterSourceSpecification, 'type'> {
		id?: string;
		source?: maplibregl.RasterTileSource;
		children?: Snippet;
	}
	let { source = $bindable(undefined), id, children, ...spec }: Props = $props();
</script>

<RawSource {id} bind:source type="raster" {...spec}>
	{@render children?.()}
</RawSource>
