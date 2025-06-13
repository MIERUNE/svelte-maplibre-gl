<script lang="ts">
	// https://maplibre.org/maplibre-gl-js/docs/API/interfaces/CustomLayerInterface/

	import { onDestroy, type Snippet } from 'svelte';
	import maplibregl from 'maplibre-gl';
	import { getMapContext } from '../contexts.svelte.js';
	import { generateLayerID, resetLayerEventListener } from '../utils.js';
	import type { MapLayerEventProps } from './common.js';

	interface Props extends MapLayerEventProps {
		id?: string;
		beforeId?: string;
		implementation: Omit<maplibregl.CustomLayerInterface, 'id' | 'type'>;
		children?: Snippet;
	}

	let {
		id: _id,
		beforeId,
		implementation,
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

	const id = _id ?? generateLayerID();

	(implementation as maplibregl.CustomLayerInterface).id ??= id;
	(implementation as maplibregl.CustomLayerInterface).type = 'custom';

	let firstRun = true;
	mapCtx.waitForStyleLoaded(() => {
		mapCtx.addLayer(implementation as maplibregl.CustomLayerInterface, beforeId);
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

	$effect(() => {
		if (beforeId && !firstRun) {
			mapCtx.waitForStyleLoaded((map) => {
				map.moveLayer(id, beforeId);
			});
		}
	});

	$effect(() => {
		firstRun = false;
	});

	onDestroy(() => {
		mapCtx.removeLayer(id);
	});
</script>

{@render children?.()}
