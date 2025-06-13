<script lang="ts">
	// https://maplibre.org/maplibre-gl-js/docs/API/classes/VectorTileSource/
	// https://maplibre.org/maplibre-style-spec/sources/#vector

	import type { Snippet } from 'svelte';
	import maplibregl from 'maplibre-gl';
	import RawSource from './RawSource.svelte';

	interface Props extends Omit<maplibregl.VectorSourceSpecification, 'type'> {
		id?: string;
		source?: maplibregl.VectorTileSource;
		children?: Snippet;
	}
	let { source = $bindable(undefined), id, children, ...spec }: Props = $props();
</script>

<RawSource {id} bind:source type="vector" {...spec}>
	{@render children?.()}
</RawSource>
