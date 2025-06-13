<script lang="ts">
	// https://maplibre.org/maplibre-gl-js/docs/API/classes/ImageSource/
	// https://maplibre.org/maplibre-style-spec/sources/#image

	import type { Snippet } from 'svelte';
	import maplibregl from 'maplibre-gl';
	import RawSource from './RawSource.svelte';

	interface Props extends Omit<maplibregl.ImageSourceSpecification, 'type'> {
		id?: string;
		source?: maplibregl.ImageSource;
		children?: Snippet;
	}
	let { source = $bindable(undefined), id, children, ...spec }: Props = $props();
</script>

<RawSource {id} bind:source type="image" {...spec}>
	{@render children?.()}
</RawSource>
