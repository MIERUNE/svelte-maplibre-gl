<script lang="ts">
	// https://maplibre.org/maplibre-gl-js/docs/API/classes/VideoSource/
	// https://maplibre.org/maplibre-style-spec/sources/#video

	import type { Snippet } from 'svelte';
	import maplibregl from 'maplibre-gl';
	import RawSource from './RawSource.svelte';

	interface Props extends Omit<maplibregl.VideoSourceSpecification, 'type'> {
		id?: string;
		source?: maplibregl.VideoSource;
		children?: Snippet;
	}
	let { source = $bindable(undefined), id, children, ...spec }: Props = $props();
</script>

<RawSource {id} bind:source type="video" {...spec}>
	{@render children?.()}
</RawSource>
