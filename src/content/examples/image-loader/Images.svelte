<script lang="ts">
	import { MapLibre, ImageLoader, GeoJSONSource, SymbolLayer } from 'svelte-maplibre-gl';
	import type { FeatureCollection } from 'geojson';

	let data: FeatureCollection = {
		type: 'FeatureCollection',
		features: [
			{
				type: 'Feature',
				geometry: { type: 'Point', coordinates: [-48.47279, -1.44585] },
				properties: { imageName: 'osgeo', year: 2024 }
			},
			{
				type: 'Feature',
				geometry: { type: 'Point', coordinates: [0, 0] },
				properties: { imageName: 'cat', scale: 0.2 }
			},
			{
				type: 'Feature',
				geometry: { type: 'Point', coordinates: [40, -30] },
				properties: { imageName: 'popup-debug', name: 'Line 1\nLine 2\nLine 3' }
			},
			{
				type: 'Feature',
				geometry: { type: 'Point', coordinates: [-40, -30] },
				properties: { imageName: 'popup-debug', name: 'One longer line' }
			}
		]
	};
</script>

<MapLibre
	class="h-[55vh] min-h-[300px]"
	style="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
	zoom={1.5}
	center={{ lng: -10.0, lat: -20 }}
>
	<GeoJSONSource {data}>
		<ImageLoader
			images={{
				osgeo: 'https://maplibre.org/maplibre-gl-js/docs/assets/osgeo-logo.png',
				cat: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/201408_cat.png',
				'popup-debug': [
					'https://maplibre.org/maplibre-gl-js/docs/assets/popup_debug.png',
					{
						// stretchable image
						stretchX: [
							[25, 55],
							[85, 115]
						],
						stretchY: [[25, 100]],
						content: [25, 25, 115, 100],
						pixelRatio: 2
					}
				]
			}}
		>
			<!-- Children components will be added after all images have been loaded -->
			<SymbolLayer
				layout={{
					'text-field': ['get', 'name'],
					'icon-image': ['get', 'imageName'],
					'icon-size': ['number', ['get', 'scale'], 1],
					'icon-text-fit': 'both',
					'icon-overlap': 'always',
					'text-overlap': 'always'
				}}
			/>
		</ImageLoader>
	</GeoJSONSource>
</MapLibre>
