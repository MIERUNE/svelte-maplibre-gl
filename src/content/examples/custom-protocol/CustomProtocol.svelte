<script lang="ts">
	import {
		MapLibre,
		RasterTileSource,
		VectorTileSource,
		RasterLayer,
		LineLayer,
		FillLayer,
		Protocol,
		PMTilesProtocol
	} from 'svelte-maplibre-gl';
	import maplibregl from 'maplibre-gl';

	const myProtocolLoadFn: maplibregl.AddProtocolAction = async (params) => {
		const zxy = params.url.replace('myprotocol://', '');
		const [z, x, y] = zxy.split('/').map((v) => parseInt(v, 10));

		const png = await new Promise((resolve) => {
			const canvas = document.createElement('canvas');
			canvas.width = 512;
			canvas.height = 512;
			const context = canvas.getContext('2d')!;

			// checkered pattern
			context.fillStyle = (z + x - y) % 2 === 0 ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)';
			context.fillRect(0, 0, canvas.width, canvas.height);
			context.fillStyle = 'white';
			context.font = '32px sans-serif';
			context.fillText(`${z}/${x}/${y}`, 32, 64);

			// canvas to blob (png) to arraybuffer
			canvas.toBlob(async (blob) => {
				resolve(await blob!.arrayBuffer());
			});
		});

		return { data: png };
	};
</script>

<!-- Adds a custom resource loading function to handle URLs that start with a custom URL scheme. -->
<PMTilesProtocol />
<Protocol scheme="myprotocol" loadFn={myProtocolLoadFn} />

<!-- Use custom protocols -->
<MapLibre class="h-[55vh] min-h-[200px]" zoom={6} center={{ lng: 140.0, lat: 37.5 }}>
	<VectorTileSource url="pmtiles://https://tile.openstreetmap.jp/static/planet.pmtiles">
		<LineLayer sourceLayer="transportation" paint={{ 'line-color': 'orange' }} />
		<FillLayer sourceLayer="water" paint={{ 'fill-color': 'dodgerblue' }} />
		<LineLayer sourceLayer="building" paint={{ 'line-color': 'lime' }} />
	</VectorTileSource>
	<RasterTileSource tiles={['myprotocol://{z}/{x}/{y}']} tileSize={256}>
		<RasterLayer />
	</RasterTileSource>
</MapLibre>
