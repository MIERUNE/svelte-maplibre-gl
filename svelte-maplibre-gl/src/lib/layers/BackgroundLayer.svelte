<script lang="ts">
	// https://maplibre.org/maplibre-style-spec/layers/#background

	import type { Snippet } from 'svelte';
	import maplibregl from 'maplibre-gl';
	import RawLayer from './RawLayer.svelte';
	import type { MapLayerEventProps } from './common.js';

	interface Props extends Omit<maplibregl.BackgroundLayerSpecification, 'id' | 'source' | 'type'>, MapLayerEventProps {
		id?: string;
		beforeId?: string;
		children?: Snippet;
	}

	let { children, ...props }: Props = $props();
</script>

<RawLayer type="background" {...props}>
	{@render children?.()}
</RawLayer>
