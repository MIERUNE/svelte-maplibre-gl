<script lang="ts">
	import { MapLibre, RasterTileSource, RasterLayer } from 'svelte-maplibre-gl';

	const protocols: Record<string, maplibregl.AddProtocolAction> = {
		myprotocol: async (params, _) => {
			const zxy = params.url.replace('custom://', '');
			const [z, x, y] = zxy.split('/').map((v) => parseInt(v, 10));

			const png = await new Promise((resolve) => {
				const canvas = document.createElement('canvas');
				canvas.width = 256;
				canvas.height = 256;
				const context = canvas.getContext('2d')!;

				// checkered pattern
				context.fillStyle = (z + x - y) % 2 === 0 ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)';
				context.fillRect(0, 0, canvas.width, canvas.height);

				// canvas to blob (png) to buffer
				canvas.toBlob(async (blob) => {
					const buf = await blob!.arrayBuffer();
					resolve(buf);
				});
			});

			return { data: png };
		}
	};
</script>

<MapLibre
	class="h-[50vh] min-h-[200px]"
	style="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
	zoom={12}
	center={{ lng: 140.09085, lat: 40.3 }}
	{protocols}
>
	<RasterTileSource tiles={['myprotocol://{z}/{x}/{y}']} tileSize={256}>
		<RasterLayer />
	</RasterTileSource>
</MapLibre>
