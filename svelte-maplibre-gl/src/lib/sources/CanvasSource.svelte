<script lang="ts">
	// https://maplibre.org/maplibre-gl-js/docs/API/classes/CanvasSource/

	import type { Snippet } from 'svelte';
	import maplibregl from 'maplibre-gl';
	import RawSource from './RawSource.svelte';

	interface Props extends Omit<maplibregl.CanvasSourceSpecification, 'type'> {
		id?: string;
		source?: maplibregl.CanvasSource;
		children?: Snippet;
	}
	let { source = $bindable(undefined), id, children, ...spec }: Props = $props();
</script>

<RawSource {id} bind:source type="canvas" {...spec}>
	{@render children?.()}
</RawSource>
