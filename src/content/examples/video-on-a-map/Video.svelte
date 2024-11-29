<script lang="ts">
	import { MapLibre, VideoSource, GlobeControl, RasterLayer } from 'svelte-maplibre-gl';
	import maplibregl from 'maplibre-gl';

	let source: maplibregl.VideoSource | undefined = $state(undefined);
	let playing = $state(true);

	function toggle() {
		if (source) {
			playing = !playing;
			playing ? source.play() : source.pause();
		}
	}
</script>

<MapLibre
	class="h-[55vh] min-h-[300px]"
	style="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
	minZoom={14}
	zoom={17}
	center={{ lng: -122.514426, lat: 37.562984 }}
	bearing={-96}
	onclick={toggle}
>
	<GlobeControl />
	<VideoSource
		bind:source
		urls={[
			'https://static-assets.mapbox.com/mapbox-gl-js/drone.mp4',
			'https://static-assets.mapbox.com/mapbox-gl-js/drone.webm'
		]}
		coordinates={[
			[-122.51596391201019, 37.56238816766053],
			[-122.51467645168304, 37.56410183312965],
			[-122.51309394836426, 37.563391708549425],
			[-122.51423120498657, 37.56161849366671]
		]}
	>
		<RasterLayer paint={{ 'raster-opacity': 0.6 }} />
	</VideoSource>
</MapLibre>
