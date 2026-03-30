<script lang="ts">
	// https://maplibre.org/maplibre-gl-js/docs/API/classes/GeoJSONSource/
	// https://maplibre.org/maplibre-style-spec/sources/#geojson

	import type { Snippet } from 'svelte';
	import maplibregl from 'maplibre-gl';
	import RawSource from './RawSource.svelte';

	interface Props extends Omit<maplibregl.GeoJSONSourceSpecification, 'type'> {
		id?: string;
		source?: maplibregl.GeoJSONSource;
		dataDiff?: maplibregl.GeoJSONSourceDiff;
		children?: Snippet;
	}
	let { source = $bindable(undefined), id, children, dataDiff, ...spec }: Props = $props();
</script>

<RawSource {id} bind:source type="geojson" {dataDiff} {...spec}>
	{@render children?.()}
</RawSource>
