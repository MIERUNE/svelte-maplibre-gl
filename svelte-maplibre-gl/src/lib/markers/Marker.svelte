<script lang="ts">
	// https://maplibre.org/maplibre-gl-js/docs/API/classes/Marker/

	import { onDestroy, untrack, type Snippet } from 'svelte';
	import * as maplibregl from 'maplibre-gl';
	import { getMapContext, prepareMarkerContext } from '../contexts.svelte.js';
	import { formatLngLat, resetEventListener } from '../utils.js';

	interface Props extends Omit<maplibregl.MarkerOptions, 'className'> {
		lnglat: maplibregl.LngLatLike;
		class?: string;
		/** HTML content of the marker */
		content?: Snippet;
		children?: Snippet;
		// Events
		// https://maplibre.org/maplibre-gl-js/docs/API/classes/Marker/#events
		ondrag?: maplibregl.Listener;
		ondragstart?: maplibregl.Listener;
		ondragend?: maplibregl.Listener;
		onclick?: maplibregl.Listener;
	}

	let container = $state<HTMLElement | null>(null);

	let {
		lnglat = $bindable(),
		class: className = undefined,
		draggable,
		rotation,
		rotationAlignment,
		pitchAlignment,
		opacity,
		color,
		opacityWhenCovered,
		offset,
		subpixelPositioning,
		content,
		children,
		ondrag,
		ondragstart,
		ondragend,
		onclick,
		...restOptions
	}: Props = $props();

	const mapCtx = getMapContext();
	if (!mapCtx.map) throw new Error('Map instance is not initialized.');

	let marker: maplibregl.Marker | null = $state.raw(null);

	const markerCtx = prepareMarkerContext();
	const defaultOffset = untrack(() => (content || restOptions.element ? [0, 0] : [0, -14]) as maplibregl.PointLike);

	$effect(() => {
		if (marker) {
			return;
		}
		if (!mapCtx.map) throw new Error('MapLibre is not initialized');

		const options: maplibregl.MarkerOptions = {
			draggable,
			offset,
			opacity,
			className,
			opacityWhenCovered,
			rotation,
			color,
			rotationAlignment,
			pitchAlignment,
			subpixelPositioning,
			...restOptions
		};

		if (content) {
			if (!container) throw new Error('Marker container is not initialized');
			options.element = container;
		}

		marker = new maplibregl.Marker(options);
		markerCtx.marker = marker;

		marker.setLngLat($state.snapshot(lnglat) as maplibregl.LngLatLike).addTo(mapCtx.map);

		marker.on('drag', (e) => {
			if (marker) {
				lnglat = formatLngLat(lnglat, marker.getLngLat());
			}
			ondrag?.(e);
		});
	});

	let firstRun = true;

	$effect(() => resetEventListener(marker, 'dragstart', ondragstart));
	$effect(() => resetEventListener(marker, 'dragend', ondragend));
	$effect(() => resetEventListener(marker, 'click', onclick));

	$effect(() => {
		draggable;
		if (!firstRun) {
			marker?.setDraggable(draggable);
		}
	});

	$effect(() => {
		if (lnglat && !firstRun) {
			marker?.setLngLat(lnglat);
		}
	});

	$effect(() => {
		rotation;
		if (!firstRun) {
			marker?.setRotation(rotation);
		}
	});

	$effect(() => {
		offset;
		if (!firstRun) {
			marker?.setOffset(offset ?? defaultOffset);
		}
	});
	$effect(() => {
		opacity;
		opacityWhenCovered;
		if (!firstRun) {
			marker?.setOpacity(opacity, opacityWhenCovered);
		}
	});
	$effect(() => {
		rotationAlignment;
		if (!firstRun) {
			marker?.setRotationAlignment(rotationAlignment);
		}
	});
	$effect(() => {
		pitchAlignment;
		if (!firstRun) {
			marker?.setPitchAlignment(pitchAlignment);
		}
	});
	$effect(() => {
		subpixelPositioning;
		if (!firstRun) {
			marker?.setSubpixelPositioning(subpixelPositioning ?? false);
		}
	});

	let prevClassNames: string[] = [];
	$effect(() => {
		const next = (className ?? '').split(/\s+/).filter(Boolean);
		if (!marker || firstRun) {
			// Initial classes are added by the Marker constructor via
			// MarkerOptions.className; record them so later diffs are correct.
			prevClassNames = next;
			return;
		}
		const nextSet = new Set(next);
		for (const c of prevClassNames) {
			if (!nextSet.has(c)) marker.removeClassName(c);
		}
		const prevSet = new Set(prevClassNames);
		for (const c of next) {
			if (!prevSet.has(c)) marker.addClassName(c);
		}
		prevClassNames = next;
	});

	$effect(() => {
		firstRun = false;
	});

	onDestroy(() => {
		marker?.remove();
	});
</script>

{#if content}
	<div bind:this={container}>
		{@render content()}
	</div>
{/if}

{@render children?.()}
