<script lang="ts">
	import 'svelte-maplibre-gl/vite';
	import type { ImageSource as MapLibreImageSource, Map as MapLibreMap, StyleSpecification } from 'maplibre-gl';
	import { ImageSource, MapLibre, RasterLayer } from 'svelte-maplibre-gl';

	type ImageSourceWarp = 'auto' | 'perspective' | 'flat';
	type WarpReadableImageSource = {
		getWarp?: () => ImageSourceWarp;
	};

	let map: MapLibreMap | undefined = $state();
	let source: MapLibreImageSource | undefined = $state();
	let warp: ImageSourceWarp | undefined = $state('perspective');
	let variant = $state<'a' | 'b'>('a');

	const styleA = {
		version: 8,
		sources: {},
		layers: [{ id: 'background-a', type: 'background', paint: { 'background-color': '#ffffff' } }]
	} satisfies StyleSpecification;
	const styleB = {
		version: 8,
		sources: {},
		layers: [{ id: 'background-b', type: 'background', paint: { 'background-color': '#eeeeee' } }]
	} satisfies StyleSpecification;
	const style = $derived(variant === 'a' ? styleA : styleB);

	$effect(() => {
		if (!map || !source) return;
		const win = window as unknown as {
			__map: MapLibreMap;
			__getImageWarp: () => ImageSourceWarp | 'unsupported';
			__setImageWarp: (next: ImageSourceWarp | undefined) => void;
			__swapImageWarpStyle: () => void;
		};
		win.__map = map;
		win.__getImageWarp = () => {
			const currentSource = map?.getSource('warp-image') as WarpReadableImageSource | undefined;
			return currentSource?.getWarp?.() ?? 'unsupported';
		};
		win.__setImageWarp = (next) => {
			warp = next;
		};
		win.__swapImageWarpStyle = () => {
			variant = 'b';
		};
	});
</script>

<MapLibre bind:map {style} class="h-[200px] w-full" zoom={1} center={{ lng: 0, lat: 0 }}>
	<ImageSource
		id="warp-image"
		bind:source
		url="/favicon.png"
		{warp}
		coordinates={[
			[-1, 1],
			[2, 1],
			[1, -1],
			[-1, -1]
		]}
	>
		<RasterLayer id="warp-layer" />
	</ImageSource>
</MapLibre>
