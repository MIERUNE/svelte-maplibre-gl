<script lang="ts">
	import { MapLibre, GeolocateControl } from 'svelte-maplibre-gl';

	let logString = $state('Press the GeolocateControl button.\n');
	function log(s: string) {
		logString += '» ' + s + '\n';
	}
</script>

<div class="flex h-[55vh] min-h-[300px] overflow-hidden rounded-md">
	<pre class="m-0! h-full flex-1 rounded-none">{logString}</pre>
	<MapLibre class="h-full flex-1" style="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json">
		<GeolocateControl
			position="top-left"
			positionOptions={{ enableHighAccuracy: true }}
			trackUserLocation={true}
			showAccuracyCircle={true}
			ontrackuserlocationstart={() => log('trackuserlocationstart')}
			ontrackuserlocationend={() => log('trackuserlocationend')}
			ongeolocate={(ev) => log(`geolocate ${JSON.stringify(ev.coords, null, 2)}`)}
		/>
	</MapLibre>
</div>
