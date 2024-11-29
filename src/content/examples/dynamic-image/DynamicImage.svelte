<script lang="ts">
	import { MapLibre, Image, GeoJSONSource, SymbolLayer } from 'svelte-maplibre-gl';

	const size = 64;
	const data = new Uint8Array(size * size * 4);

	let p = 0;
	for (let x = 0; x < size; x++) {
		for (let y = 0; y < size; y++) {
			data[p + 0] = (y / size) * 255;
			data[p + 1] = (x / size) * 255;
			data[p + 2] = 128;
			data[p + 3] = 255;
			p += 4;
		}
	}
</script>

<MapLibre
	class="h-[55vh] min-h-[300px]"
	style="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
	zoom={4}
	center={{ lng: 137, lat: 36 }}
>
	<Image id="gradient" image={{ width: size, height: size, data }} />
	<GeoJSONSource
		data={{
			type: 'FeatureCollection',
			features: [
				{
					type: 'Feature',
					geometry: {
						type: 'Point',
						coordinates: [137, 36]
					},
					properties: {}
				}
			]
		}}
	>
		<SymbolLayer layout={{ 'icon-image': 'gradient' }} />
	</GeoJSONSource>
</MapLibre>
