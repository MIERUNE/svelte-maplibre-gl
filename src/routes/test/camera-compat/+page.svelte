<script lang="ts">
	import 'svelte-maplibre-gl/vite';
	import { page } from '$app/state';
	import { untrack } from 'svelte';
	import { MapLibre, ImageSource, RasterLayer } from 'svelte-maplibre-gl';
	import type { Map } from 'maplibre-gl';
	let map: Map | undefined = $state();
	let zoom = $state(2);
	let bearing = $state(0);
	let imageUrl: string | undefined = $state(
		untrack(() => (page.url.searchParams.has('empty-image') ? undefined : '/favicon.png'))
	);
	$effect(() => {
		if (map) (window as unknown as { __map: Map }).__map = map;
	});
</script>

<button
	onclick={() => {
		zoom = 4;
		bearing = 45;
	}}>Set camera</button
>
<button
	onclick={() => {
		imageUrl = '/favicon.png';
	}}>Set image</button
>
<output data-camera>{zoom.toFixed(1)} / {bearing.toFixed(1)}</output>
<MapLibre
	bind:map
	bind:zoom
	bind:bearing
	center={[0, 0]}
	style={{ version: 8, sources: {}, layers: [] }}
	class="h-[400px] w-full"
>
	<ImageSource
		id="empty-image"
		url={imageUrl}
		coordinates={[
			[-1, 1],
			[1, 1],
			[1, -1],
			[-1, -1]
		]}
	>
		<RasterLayer id="empty-image-layer" />
	</ImageSource>
</MapLibre>
