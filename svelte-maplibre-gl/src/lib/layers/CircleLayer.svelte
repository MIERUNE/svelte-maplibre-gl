<script lang="ts">
	// https://maplibre.org/maplibre-style-spec/layers/#circle

	import type { Snippet } from 'svelte';
	import maplibregl from 'maplibre-gl';
	import RawLayer from './RawLayer.svelte';
	import type { MapLayerEventProps } from './common.js';

	interface Props
		extends Omit<maplibregl.CircleLayerSpecification, 'id' | 'source' | 'type' | 'source-layer'>,
			MapLayerEventProps {
		id?: string;
		sourceLayer?: maplibregl.CircleLayerSpecification['source-layer'];
		beforeId?: string;
		children?: Snippet;
	}

	let { children, sourceLayer, ...props }: Props = $props();
</script>

<RawLayer type="circle" source-layer={sourceLayer} {...props}>
	{@render children?.()}
</RawLayer>
