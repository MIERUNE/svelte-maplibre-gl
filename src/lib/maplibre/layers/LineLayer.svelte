<script lang="ts">
	// https://maplibre.org/maplibre-style-spec/layers/#line

	import type { Snippet } from 'svelte';
	import maplibregl from 'maplibre-gl';
	import RawLayer from './RawLayer.svelte';
	import type { MapLayerEventProps } from './common.js';

	interface Props
		extends Omit<maplibregl.LineLayerSpecification, 'id' | 'source' | 'type' | 'source-layer'>,
			MapLayerEventProps {
		id?: string;
		source?: string;
		sourceLayer?: maplibregl.LineLayerSpecification['source-layer'];
		beforeId?: string;
		children?: Snippet;
	}

	let { children, sourceLayer, ...props }: Props = $props();
</script>

<RawLayer type="line" source-layer={sourceLayer} {...props}>
	{@render children?.()}
</RawLayer>
