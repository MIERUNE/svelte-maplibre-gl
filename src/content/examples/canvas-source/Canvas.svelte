<script lang="ts">
	import { MapLibre, CanvasSource, GlobeControl, RasterLayer } from 'svelte-maplibre-gl';
	import { Circle } from './Circle.js';

	let canvas: HTMLCanvasElement | undefined = $state();
	let ctx = $derived(canvas && canvas.getContext('2d')!);
	let animate = $state(true);

	const SIZE = 500;
	const RADIUS = 15;
	const circles: Circle[] = [];
	for (let i = 0; i < 20; i++) {
		const x = Math.random() * (SIZE - RADIUS * 2) + RADIUS;
		const y = Math.random() * (SIZE - RADIUS * 2) + RADIUS;
		const dx = (Math.random() - 0.5) * 2;
		const dy = (Math.random() - 0.5) * 2;
		const color = `#${(0x1000000 + Math.random() * 0xffffff).toString(16).substring(1, 7)}`;
		circles.push(new Circle(x, y, dx, dy, RADIUS, color));
	}

	function frame() {
		if (ctx && animate) {
			ctx.clearRect(0, 0, SIZE, SIZE);
			for (const circle of circles) {
				circle.update(ctx);
			}
		}
		requestAnimationFrame(frame);
	}

	$effect(() => {
		requestAnimationFrame(frame);
	});
</script>

<canvas bind:this={canvas} class="hidden" width={SIZE} height={SIZE}>Canvas not supported</canvas>

<MapLibre
	class="h-[55vh] min-h-[300px]"
	style="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
	zoom={2}
	center={{ lng: 135, lat: 35 }}
	onclick={() => (animate = !animate)}
>
	<GlobeControl />
	<CanvasSource
		{canvas}
		{animate}
		coordinates={[
			[110, 60],
			[160, 60],
			[160, 10],
			[110, 10]
		]}
	>
		<RasterLayer paint={{ 'raster-fade-duration': 0 }} />
	</CanvasSource>
</MapLibre>
