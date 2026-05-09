<script lang="ts">
	import { onDestroy, untrack, type Snippet } from 'svelte';
	import type * as maplibregl from 'maplibre-gl';
	import { getMapContext, getSourceContext, prepareLayerContext } from '../contexts.svelte.js';
	import { generateLayerID, resetLayerEventListener } from '../utils.js';
	import type { MapLayerEventProps } from './common.js';

	interface Props
		extends Omit<maplibregl.LayerSpecification, 'id' | 'source' | 'source-layer' | 'filter'>, MapLayerEventProps {
		id?: string;
		source?: string;
		beforeId?: string;
		filter?: maplibregl.FilterSpecification;
		'source-layer'?: string;
		children?: Snippet;
	}

	let {
		id: _id,
		source: sourceId,
		beforeId,
		type,
		paint,
		layout,
		filter,
		'source-layer': sourceLayer,
		maxzoom,
		minzoom,
		metadata,
		children,

		// Events
		// https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/MapLayerEventType/
		onclick,
		ondblclick,
		onmousedown,
		onmouseup,
		onmousemove,
		onmouseenter,
		onmouseleave,
		onmouseover,
		onmouseout,
		oncontextmenu,
		ontouchstart,
		ontouchend,
		ontouchcancel
	}: Props = $props();

	const mapCtx = getMapContext();
	if (!mapCtx.map) throw new Error('Map instance is not initialized.');

	const id = untrack(() => _id) ?? generateLayerID();
	const layerCtx = prepareLayerContext();
	layerCtx.id = id;

	const addLayerObj = untrack(() => {
		const layer = {
			id,
			type,
			layout: $state.snapshot(layout) ?? {},
			paint: $state.snapshot(paint) ?? {}
		} as maplibregl.LayerSpecification;

		if (layer.type !== 'background') {
			layer.source = sourceId ?? getSourceContext().id;
		}

		if (maxzoom !== undefined) {
			layer.maxzoom = maxzoom;
		}
		if (minzoom !== undefined) {
			layer.minzoom = minzoom;
		}
		if (metadata !== undefined) {
			layer.metadata = metadata;
		}
		if (layer.type !== 'background') {
			if (sourceLayer) {
				layer['source-layer'] = sourceLayer;
			}
			if (filter) {
				// @ts-expect-error: ignore
				layer.filter = $state.snapshot(filter) as maplibregl.FilterSpecification;
			}
		}

		return layer;
	});

	let firstRun = true;
	let mounting = false;
	const addLayerAbortController = new AbortController();
	$effect(() => {
		if (mounting || !firstRun) return;
		mounting = true;

		if (addLayerObj.type === 'background') {
			mapCtx.addLayer(addLayerObj, beforeId);
			firstRun = false;
			mounting = false;
			return;
		}

		mapCtx.waitForSourceRegistered(
			addLayerObj.source,
			() => {
				mapCtx.addLayer(addLayerObj, beforeId);
				firstRun = false;
				mounting = false;
			},
			{ signal: addLayerAbortController.signal }
		);
	});

	$effect(() => resetLayerEventListener(mapCtx.map, 'click', id, onclick));
	$effect(() => resetLayerEventListener(mapCtx.map, 'dblclick', id, ondblclick));
	$effect(() => resetLayerEventListener(mapCtx.map, 'mousedown', id, onmousedown));
	$effect(() => resetLayerEventListener(mapCtx.map, 'mouseup', id, onmouseup));
	$effect(() => resetLayerEventListener(mapCtx.map, 'mousemove', id, onmousemove));
	$effect(() => resetLayerEventListener(mapCtx.map, 'mouseenter', id, onmouseenter));
	$effect(() => resetLayerEventListener(mapCtx.map, 'mouseleave', id, onmouseleave));
	$effect(() => resetLayerEventListener(mapCtx.map, 'mouseover', id, onmouseover));
	$effect(() => resetLayerEventListener(mapCtx.map, 'mouseout', id, onmouseout));
	$effect(() => resetLayerEventListener(mapCtx.map, 'contextmenu', id, oncontextmenu));
	$effect(() => resetLayerEventListener(mapCtx.map, 'touchstart', id, ontouchstart));
	$effect(() => resetLayerEventListener(mapCtx.map, 'touchend', id, ontouchend));
	$effect(() => resetLayerEventListener(mapCtx.map, 'touchcancel', id, ontouchcancel));

	let prevPaint: Record<string, unknown> = untrack(() => $state.snapshot(paint) ?? {});
	$effect(() => {
		paint;
		if (!firstRun) {
			mapCtx.waitForStyleLoaded((map) => {
				// eslint-disable-next-line svelte/prefer-svelte-reactivity
				const keysRemoved = new Set(Object.keys(prevPaint));
				const _paint = $state.snapshot(paint) ?? {};
				for (const [key, value] of Object.entries(_paint)) {
					keysRemoved.delete(key);
					if (prevPaint[key] !== value) {
						map.setPaintProperty(id, key, value);
					}
				}
				for (const key of keysRemoved) {
					map.setPaintProperty(id, key, undefined);
				}
				prevPaint = _paint;
			});
		}
	});

	let prevLayout: Record<string, unknown> = untrack(() => $state.snapshot(layout) ?? {});
	$effect(() => {
		layout;
		if (!firstRun) {
			mapCtx.waitForStyleLoaded((map) => {
				// eslint-disable-next-line svelte/prefer-svelte-reactivity
				const keysRemoved = new Set(Object.keys(prevLayout));
				const _layout = $state.snapshot(layout) ?? {};
				for (const [key, value] of Object.entries(_layout)) {
					keysRemoved.delete(key);
					if (prevLayout[key] !== value) {
						map.setLayoutProperty(id, key, value);
					}
				}
				for (const key of keysRemoved) {
					map.setLayoutProperty(id, key, undefined);
				}
				prevLayout = _layout;
			});
		}
	});

	$effect(() => {
		if ((minzoom !== undefined || maxzoom !== undefined) && !firstRun) {
			mapCtx.waitForStyleLoaded((map) => {
				map.setLayerZoomRange(id, minzoom ?? 0, maxzoom ?? 22);
			});
		}
	});

	$effect(() => {
		filter;
		if (!firstRun) {
			mapCtx.waitForStyleLoaded((map) => {
				map.setFilter(id, $state.snapshot(filter) as maplibregl.FilterSpecification);
			});
		}
	});

	$effect(() => {
		if (beforeId && !firstRun) {
			mapCtx.waitForStyleLoaded((map) => {
				map.moveLayer(id, beforeId);
			});
		}
	});

	onDestroy(() => {
		mapCtx.removeLayer(id);
		addLayerAbortController.abort();
	});
</script>

{@render children?.()}
