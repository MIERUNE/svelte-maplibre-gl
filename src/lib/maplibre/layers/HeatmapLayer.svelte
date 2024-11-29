<script lang="ts">
	// https://maplibre.org/maplibre-style-spec/layers/#heatmap

	import type { Snippet } from 'svelte';
	import maplibregl from 'maplibre-gl';
	import RawLayer from './RawLayer.svelte';
	import type { MapLayerEventProps } from './common.js';

	interface Props
		extends Omit<maplibregl.HeatmapLayerSpecification, 'id' | 'source' | 'type' | 'source-layer'>,
			MapLayerEventProps {
		id?: string;
		source?: string;
		sourceLayer?: maplibregl.HeatmapLayerSpecification['source-layer'];
		beforeId?: string;
		children?: Snippet;
	}

	let { children, sourceLayer, ...props }: Props = $props();
</script>

<RawLayer type="heatmap" source-layer={sourceLayer} {...props}>
	{@render children?.()}
</RawLayer>
