<script lang="ts">
	// E2E fixture mirroring the markup-order pattern from /examples/complex:
	// non-source layers (RasterLayer, BackgroundLayer anchors) interleaved
	// with source-bound layers that reference those anchors via beforeId.
	import type { Map as MapLibreMap } from 'maplibre-gl';
	import {
		BackgroundLayer,
		CircleLayer,
		FillLayer,
		GeoJSONSource,
		LineLayer,
		MapLibre,
		RasterLayer,
		RasterTileSource,
		VectorTileSource
	} from 'svelte-maplibre-gl';

	let map: MapLibreMap | undefined = $state();
	$effect(() => {
		if (map) (window as unknown as { __map: MapLibreMap }).__map = map;
	});

	const emptyStyle = { version: 8 as const, sources: {}, layers: [] };
	const points = {
		type: 'FeatureCollection' as const,
		features: [
			{
				type: 'Feature' as const,
				geometry: { type: 'Point' as const, coordinates: [0, 0] as [number, number] },
				properties: {}
			}
		]
	};
</script>

<MapLibre bind:map style={emptyStyle} class="h-[200px] w-full" zoom={1} center={{ lng: 0, lat: 0 }}>
	<RasterTileSource id="raster-src" tiles={['data:image/png;base64,']} minzoom={0} maxzoom={1}>
		<RasterLayer id="raster" />
	</RasterTileSource>
	<BackgroundLayer id="dummy1" layout={{ visibility: 'none' }} />
	<BackgroundLayer id="dummy2" layout={{ visibility: 'none' }} />
	<BackgroundLayer id="dummy3" layout={{ visibility: 'none' }} />
	<VectorTileSource id="vector-src" tiles={['data:application/x-protobuf;base64,']} minzoom={0} maxzoom={1}>
		<LineLayer id="line" sourceLayer="x" beforeId="dummy3" paint={{ 'line-color': '#f0f' }} />
		<FillLayer id="fill" sourceLayer="x" beforeId="dummy2" paint={{ 'fill-color': '#0f0' }} />
	</VectorTileSource>
	<GeoJSONSource id="circles-src" data={points}>
		<CircleLayer id="circles" beforeId="dummy3" paint={{ 'circle-radius': 4 }} />
	</GeoJSONSource>
</MapLibre>
