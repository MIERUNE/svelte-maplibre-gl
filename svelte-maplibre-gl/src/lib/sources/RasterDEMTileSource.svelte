<script lang="ts">
	// https://maplibre.org/maplibre-gl-js/docs/API/classes/RasterDEMTileSource/
	// https://maplibre.org/maplibre-style-spec/sources/#raster-dem

	import type { Snippet } from 'svelte';
	import maplibregl from 'maplibre-gl';
	import RawSource from './RawSource.svelte';

	interface Props extends Omit<maplibregl.RasterDEMSourceSpecification, 'type'> {
		id?: string;
		source?: maplibregl.RasterDEMTileSource;
		children?: Snippet;
	}
	let { source = $bindable(undefined), id, children, ...spec }: Props = $props();
</script>

<RawSource {id} bind:source type="raster-dem" {...spec}>
	{@render children?.()}
</RawSource>
