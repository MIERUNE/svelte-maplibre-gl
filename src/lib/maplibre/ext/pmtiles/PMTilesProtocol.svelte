<script lang="ts">
	import { Protocol as MapLibreProtocol } from 'svelte-maplibre-gl';
	import { Protocol, PMTiles } from 'pmtiles';

	let {
		scheme = 'pmtiles',
		metadata = false,
		errorOnMissingTile = false,
		pmtiles
	}: {
		/** URL scheme for the PMTilesProtocol */
		scheme?: string;
		/** Also load the metadata section of the PMTiles. required for some "inspect" functionality
		 * and to automatically populate the map attribution. Requires an extra HTTP request.
		 */
		metadata?: boolean;
		/** When a vector MVT tile is missing from the archive, raise an error instead of
		 * returning the empty array. Not recommended. This is only to reproduce the behavior of ZXY tile APIs
		 * which some applications depend on when overzooming. */
		errorOnMissingTile?: boolean;
		/** Array of PMTiles instances */
		pmtiles?: PMTiles[];
	} = $props();

	const protocol = new Protocol({ metadata, errorOnMissingTile });

	$effect(() => {
		protocol.metadata = metadata;
	});

	$effect(() => {
		protocol.errorOnMissingTile = errorOnMissingTile;
	});

	$effect(() => {
		if (pmtiles) {
			for (const pmtile of pmtiles) {
				protocol.add(pmtile);
			}
		}
	});
</script>

<MapLibreProtocol {scheme} loadFn={protocol.tile} />
