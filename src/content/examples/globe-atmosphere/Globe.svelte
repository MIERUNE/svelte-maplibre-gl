<script lang="ts">
	import { MapLibre, Projection, Sky, Light } from 'svelte-maplibre-gl';

	let thetaDeg = $state(135);
	let phiDeg = $state(0);
	let p = $derived(
		(Math.acos(Math.cos((thetaDeg / 180 + 1) * Math.PI) * Math.cos((phiDeg / 180) * Math.PI)) / Math.PI) * 180
	);
	let a = $derived(
		90 +
			(Math.atan2(
				Math.sin((phiDeg / 180) * Math.PI),
				Math.sin((thetaDeg / 180 + 1) * Math.PI) * Math.cos((phiDeg / 180) * Math.PI)
			) /
				Math.PI) *
				180
	);
</script>

<MapLibre
	class="h-[55vh] min-h-[300px]"
	style="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
	zoom={1.5}
	center={{ lng: 155, lat: 45 }}
>
	<Projection type="globe" />
	<Light anchor="map" position={[100, a, p]} />
	<Sky atmosphere-blend={['interpolate', ['linear'], ['zoom'], 0, 1, 5, 1, 7, 0]} />

	<!-- Control -->
	<div
		class="absolute top-3 left-3 z-10 flex min-w-[200px] flex-col items-stretch gap-1 rounded bg-background/60 p-3 text-sm backdrop-blur-sm"
	>
		<div class="mb-4 flex flex-col items-center space-y-2 px-2">
			<label for="theta" class="leading-none">Theta ({thetaDeg})</label>
			<input type="range" id="theta" bind:value={thetaDeg} min={-180} max={180} />
		</div>
		<div class="mb-4 flex flex-col items-center space-y-2 px-2">
			<label for="phi" class="leading-none">Phi ({phiDeg.toFixed(1)})</label>
			<input type="range" id="phi" bind:value={phiDeg} min={-90} max={90} step={0.1} />
		</div>
	</div>
</MapLibre>
