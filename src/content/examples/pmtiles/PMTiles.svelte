<script lang="ts">
	import { MapLibre } from 'svelte-maplibre-gl';
	import { PMTilesProtocol } from 'svelte-maplibre-gl/pmtiles';
	import type { LayerSpecification } from 'maplibre-gl';

	// Get the layers spec from the OSM style
	let layers: LayerSpecification[] = $state.raw([]);
	$effect(() => {
		fetch('https://tile.openstreetmap.jp/styles/openmaptiles/style.json')
			.then((response) => response.json())
			.then((data) => {
				layers = data['layers'].filter(
					(layer: LayerSpecification) => !('source' in layer) || layer.source === 'openmaptiles'
				);
			});
	});
</script>

<!-- Add pmtiles:// Protocol -->
<PMTilesProtocol />

<!-- Use custom protocols -->
<MapLibre
	class="h-[55vh] min-h-[200px]"
	zoom={10}
	center={[12.484151635086198, 41.8960910478323]}
	style={{
		version: 8,
		glyphs: 'https://tile.openstreetmap.jp/fonts/{fontstack}/{range}.pbf',
		sprite: 'https://tile.openstreetmap.jp/styles/openmaptiles/sprite',
		sources: {
			openmaptiles: {
				type: 'vector',
				url: 'pmtiles://https://tile.openstreetmap.jp/static/planet.pmtiles',
				attribution: '© OpenMapTiles © OpenStreetMap contributors'
			}
		},
		layers
	}}
></MapLibre>
