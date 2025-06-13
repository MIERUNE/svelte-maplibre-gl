<script lang="ts">
	// https://maplibre.org/maplibre-gl-js/docs/API/classes/Marker/

	import { onDestroy, type Snippet } from 'svelte';
	import maplibregl from 'maplibre-gl';
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
		...restOptions
	}: Props = $props();

	const mapCtx = getMapContext();
	if (!mapCtx.map) throw new Error('Map instance is not initialized.');

	let marker: maplibregl.Marker | null = $state.raw(null);

	const markerCtx = prepareMarkerContext();

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
		if (offset && !firstRun) {
			marker?.setOffset(offset);
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
		if (rotationAlignment && !firstRun) {
			marker?.setRotationAlignment(rotationAlignment);
		}
	});
	$effect(() => {
		if (pitchAlignment && !firstRun) {
			marker?.setPitchAlignment(pitchAlignment);
		}
	});
	$effect(() => {
		if (subpixelPositioning !== undefined && !firstRun) {
			marker?.setSubpixelPositioning(subpixelPositioning);
		}
	});

	$effect(() => {
		// TODO: differential update ?
		const classNames = (className ?? '')?.split(/\s/).filter(Boolean);
		if (marker && !firstRun) {
			for (const className of classNames) {
				marker.addClassName(className);
			}
		}
		return () => {
			if (marker) {
				for (const className of classNames) {
					marker.removeClassName(className);
				}
			}
		};
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
