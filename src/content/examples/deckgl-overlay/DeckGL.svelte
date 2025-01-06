<script lang="ts">
	import { onMount } from 'svelte';
	import { MapLibre, FillExtrusionLayer } from 'svelte-maplibre-gl';
	import { DeckGLOverlay } from 'svelte-maplibre-gl/deckgl';
	import { ArcLayer } from '@deck.gl/layers';

	const NUM = 30;
	let data: { source: [number, number]; target: [number, number] }[] = $state([]);

	onMount(() => {
		let handle = requestAnimationFrame(function updateFrame(t) {
			data = Array.from({ length: NUM }, (_, i) => {
				const O = (2 * Math.PI) / NUM;
				const r = (1.3 + Math.sin(t / 510 + i * O)) * 0.002;
				return {
					source: [139.7672, 35.6812],
					target: [139.7672 + Math.cos(t / 730 + i * O) * r, 35.6812 + Math.sin(t / 730 + i * O) * r]
				};
			});
			handle = requestAnimationFrame(updateFrame);
		});
		return () => cancelAnimationFrame(handle);
	});
</script>

<MapLibre
	class="h-[55vh] min-h-[300px]"
	style="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
	zoom={15}
	pitch={60}
	minZoom={4}
	bearing={-45}
	center={[139.7672, 35.6812]}
>
	<DeckGLOverlay
		interleaved
		layers={[
			new ArcLayer({
				id: 'deckgl-arc',
				data,
				getSourcePosition: (d) => d.source,
				getTargetPosition: (d) => d.target,
				getSourceColor: [0, 255, 100],
				getTargetColor: [0, 190, 255],
				getWidth: 5
			})
		]}
	/>
	<FillExtrusionLayer
		source="carto"
		sourceLayer="building"
		minzoom={14}
		paint={{
			'fill-extrusion-color': '#aaa',
			'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 14, 0, 14.05, ['get', 'render_height']],
			'fill-extrusion-base': ['interpolate', ['linear'], ['zoom'], 14, 0, 14.05, ['get', 'render_min_height']],
			'fill-extrusion-opacity': 0.8
		}}
	/>
</MapLibre>
