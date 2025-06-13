<script lang="ts">
	// https://maplibre.org/maplibre-style-spec/layers/#symbol

	import type { Snippet } from 'svelte';
	import maplibregl from 'maplibre-gl';
	import RawLayer from './RawLayer.svelte';
	import type { MapLayerEventProps } from './common.js';

	interface Props
		extends Omit<maplibregl.SymbolLayerSpecification, 'id' | 'source' | 'type' | 'source-layer'>,
			MapLayerEventProps {
		id?: string;
		source?: string;
		sourceLayer?: maplibregl.SymbolLayerSpecification['source-layer'];
		beforeId?: string;
		children?: Snippet;
	}

	let { children, sourceLayer, ...props }: Props = $props();
</script>

<RawLayer type="symbol" source-layer={sourceLayer} {...props}>
	{@render children?.()}
</RawLayer>
