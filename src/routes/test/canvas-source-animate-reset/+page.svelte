<script lang="ts">
	import type { CanvasSource as MapLibreCanvasSource, Map as MapLibreMap, StyleSpecification } from 'maplibre-gl';
	import { CanvasSource, MapLibre, RasterLayer } from 'svelte-maplibre-gl';

	let map: MapLibreMap | undefined = $state();
	let source: MapLibreCanvasSource | undefined = $state();
	let canvas: HTMLCanvasElement | undefined = $state();
	let animate: boolean | undefined = $state(false);

	const style = {
		version: 8,
		sources: {},
		layers: [{ id: 'background', type: 'background', paint: { 'background-color': '#ffffff' } }]
	} satisfies StyleSpecification;

	$effect(() => {
		if (!map || !source) return;
		const win = window as unknown as {
			__source: MapLibreCanvasSource;
			__resetCanvasAnimate: () => void;
		};
		win.__source = source;
		win.__resetCanvasAnimate = () => {
			animate = undefined;
		};
	});
</script>

<canvas bind:this={canvas} width="2" height="2" hidden></canvas>

<MapLibre bind:map {style} class="h-[200px] w-full" zoom={1} center={{ lng: 0, lat: 0 }}>
	{#if canvas}
		<CanvasSource
			id="canvas-source"
			bind:source
			{canvas}
			{animate}
			coordinates={[
				[-1, 1],
				[1, 1],
				[1, -1],
				[-1, -1]
			]}
		>
			<RasterLayer id="canvas-layer" />
		</CanvasSource>
	{/if}
</MapLibre>
