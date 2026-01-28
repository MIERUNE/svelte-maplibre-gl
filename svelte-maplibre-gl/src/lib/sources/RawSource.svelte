<script lang="ts">
	import maplibregl from 'maplibre-gl';
	import { onDestroy, type Snippet } from 'svelte';
	import { getMapContext, prepareSourceContext } from '../contexts.svelte.js';
	import { generateSourceID } from '../utils.js';

	type Source =
		| maplibregl.GeoJSONSource
		| maplibregl.CanvasSource
		| maplibregl.VectorTileSource
		| maplibregl.RasterTileSource
		| maplibregl.RasterDEMTileSource
		| maplibregl.CanvasSource
		| maplibregl.ImageSource
		| maplibregl.VideoSource;
	type TileSource = maplibregl.VectorTileSource | maplibregl.RasterTileSource | maplibregl.RasterDEMTileSource;

	type Specs = maplibregl.SourceSpecification | maplibregl.CanvasSourceSpecification;

	type Props = {
		id?: string;
		source?: Source;
		children?: Snippet;
	} & Specs;
	let { source = $bindable(undefined), id: _id, children, ...spec }: Props = $props();
	spec = spec as Specs;

	const mapCtx = getMapContext();
	if (!mapCtx.map) throw new Error('Map instance is not initialized.');

	let firstRun = true;

	const id = _id ?? generateSourceID();
	const sourceCtx = prepareSourceContext();
	sourceCtx.id = id;
	let addingSource = false;
	let sourceLoadAbortController = new AbortController();
	$effect(() => {
		if (addingSource || !firstRun) {
			return;
		}

		addingSource = true;
		mapCtx.waitForStyleLoaded(
			() => {
				mapCtx.addSource(id, $state.snapshot(spec) as Specs);

				mapCtx.waitForSourceLoaded(
					id,
					(map, error) => {
						if (error) {
							console.error(`Error loading source '${id}':`, error);
						}

						if (!error) {
							firstRun = false;
						}

						addingSource = false;
						source = map.getSource(id);
					},
					{ signal: sourceLoadAbortController.signal }
				);
			},
			{ signal: sourceLoadAbortController.signal }
		);
	});

	$effect(() => {
		if (source && spec.type !== 'canvas' && spec.type !== 'video' && spec.type !== 'image') {
			source.maxzoom = spec.maxzoom ?? 22;
			if (spec.type !== 'geojson') {
				source.minzoom = spec.minzoom ?? 0;
			}
		}
	});
	$effect(() => {
		if (
			source &&
			'setTiles' in source &&
			(spec.type === 'vector' || spec.type === 'raster' || spec.type === 'raster-dem')
		) {
			spec.tiles;

			if (firstRun) {
				return;
			}

			// if there is a TileJSON url specified, do not set tiles since
			// they will be retreived from the TileJSON resource instead
			if (spec.url) {
				return;
			}

			const isDifferentTilesArray =
				!source.tiles ||
				!spec.tiles ||
				spec.tiles.length !== source.tiles.length ||
				spec.tiles.some((tile, index) => tile !== (source as TileSource).tiles[index]);
			if (!isDifferentTilesArray) {
				return;
			}

			source.setTiles(spec.tiles ?? []);
		}
	});
	$effect(() => {
		if (source && (spec.type === 'vector' || spec.type === 'raster' || spec.type === 'raster-dem')) {
			spec.url;
			if (!firstRun && 'setUrl' in source && spec.url !== source.url) {
				source.setUrl(spec.url as string);
			}
		}
	});
	$effect(() => {
		if (source && spec.type === 'image') {
			spec.url;
			if (!firstRun) {
				(source as maplibregl.ImageSource).updateImage({ url: spec.url });
			}
		}
	});
	$effect(() => {
		if (source && (spec.type === 'image' || spec.type === 'video' || spec.type === 'canvas')) {
			spec.coordinates;
			if (!firstRun) {
				if (!('setCoordinates' in source)) throw new Error('setCoordinates method is not supported');
				source.setCoordinates(spec.coordinates);
			}
		}
	});
	$effect(() => {
		if (spec.type === 'canvas') {
			spec.animate;
			if (source && spec.animate !== undefined && !firstRun) {
				const cs = source as maplibregl.CanvasSource;
				spec.animate ? cs.play() : cs.pause();
			}
		}
	});
	$effect(() => {
		if (source && spec.type === 'geojson') {
			spec.data;
			if (!firstRun) {
				// TODO: support diffrential update ? (updateData)
				(source as maplibregl.GeoJSONSource).setData(spec.data);
			}
		}
	});
	$effect(() => {
		if (source && spec.type === 'geojson') {
			spec.cluster;
			spec.clusterMaxZoom;
			spec.clusterRadius;
			if (!firstRun) {
				if (spec.clusterRadius !== undefined) {
					(source as maplibregl.GeoJSONSource).workerOptions.superclusterOptions!.radius =
						spec.clusterRadius * (8192 / source.tileSize);
				}
				(source as maplibregl.GeoJSONSource).setClusterOptions({
					cluster: spec.cluster,
					clusterMaxZoom: spec.clusterMaxZoom
					// clusterRadius: spec.clusterRadius, // TODO: Requires a fix in maplibre-gl-js
				});
			}
		}
	});

	onDestroy(() => {
		mapCtx.removeSource(id);
		sourceLoadAbortController.abort();
		source = undefined;
	});
</script>

{@render children?.()}
