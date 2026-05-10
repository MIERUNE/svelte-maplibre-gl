<script lang="ts">
	import { MapLibre, GeoJSONSource, CircleLayer } from 'svelte-maplibre-gl';
	import type GeoJSON from 'geojson';

	const CURSORS = [
		'cell',
		'col-resize',
		'context-menu',
		'copy',
		'crosshair',
		'default',
		'grab',
		'help',
		'move',
		'not-allowed',
		'pointer',
		'progress',
		'row-resize',
		'text',
		'vertical-text',
		'wait',
		'zoom-in',
		'zoom-out'
	];
	const center = [0, 0];
	const data: GeoJSON.FeatureCollection = {
		type: 'FeatureCollection',
		features: CURSORS.map((cursor, i) => ({
			type: 'Feature',
			geometry: {
				type: 'Point',
				coordinates: [
					center[0] + Math.cos((i / CURSORS.length) * Math.PI * 2) * 15,
					center[1] + Math.sin((i / CURSORS.length) * Math.PI * 2) * 15
				]
			},
			properties: { cursor }
		}))
	};

	let cursor: string | undefined = $state();
</script>

<MapLibre
	class="h-[55vh] min-h-75"
	style="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
	zoom={2}
	center={{ lng: 0, lat: 0 }}
	{cursor}
>
	<GeoJSONSource {data}>
		<CircleLayer
			onmousemove={(e) => (cursor = e.features![0].properties.cursor)}
			onmouseleave={() => (cursor = undefined)}
			paint={{
				'circle-radius': 12,
				'circle-color': '#007cbf',
				'circle-stroke-color': '#fff',
				'circle-stroke-width': 3
			}}
		/>
	</GeoJSONSource>
</MapLibre>
