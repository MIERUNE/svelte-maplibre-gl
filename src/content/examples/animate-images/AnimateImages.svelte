<script lang="ts">
	import { MapLibre, ImageSource, GlobeControl, RasterLayer } from 'svelte-maplibre-gl';

	const FRAME_COUNT = 5;
	let frame = $state(0);

	$effect(() => {
		function update() {
			frame = Math.round((performance.now() / 1000) * 5) % FRAME_COUNT;
			requestAnimationFrame(update);
		}
		requestAnimationFrame(update);
	});
</script>

<MapLibre
	class="h-[55vh] min-h-[300px]"
	style="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
	zoom={5}
	center={[-76, 43]}
>
	<GlobeControl />
	<ImageSource
		url={`https://maplibre.org/maplibre-gl-js/docs/assets/radar${frame}.gif`}
		coordinates={[
			[-80.425, 46.437],
			[-71.516, 46.437],
			[-71.516, 37.936],
			[-80.425, 37.936]
		]}
	>
		<RasterLayer paint={{ 'raster-fade-duration': 0 }} />
	</ImageSource>
</MapLibre>
