<script lang="ts">
	// https://maplibre.org/maplibre-style-spec/layers/#fill

	import type { Snippet } from 'svelte';
	import maplibregl from 'maplibre-gl';
	import RawLayer from './RawLayer.svelte';
	import type { MapLayerEventProps } from './common.js';

	interface Props
		extends Omit<maplibregl.FillLayerSpecification, 'id' | 'source' | 'type' | 'source-layer'>,
			MapLayerEventProps {
		id?: string;
		source?: string;
		sourceLayer?: maplibregl.FillLayerSpecification['source-layer'];
		beforeId?: string;
		children?: Snippet;
	}

	let { children, sourceLayer, ...props }: Props = $props();
</script>

<RawLayer type="fill" source-layer={sourceLayer} {...props}>
	{@render children?.()}
</RawLayer>
