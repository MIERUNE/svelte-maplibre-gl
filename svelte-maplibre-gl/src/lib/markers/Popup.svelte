<script lang="ts">
	// https://maplibre.org/maplibre-gl-js/docs/API/classes/Popup/

	import { onDestroy, type Snippet } from 'svelte';
	import * as maplibregl from 'maplibre-gl';
	import { getMapContext, getMarkerContext } from '../contexts.svelte.js';

	interface Props extends Omit<maplibregl.PopupOptions, 'className'> {
		lnglat?: maplibregl.LngLatLike;
		/**
		 * If `true`, the popup follows the cursor position instead of being anchored to `lnglat`.
		 * Hidden on touchscreens. Replaces the `lnglat` behavior while enabled.
		 *
		 * https://maplibre.org/maplibre-gl-js/docs/API/classes/Popup/#trackpointer
		 */
		trackPointer?: boolean;
		class?: string;
		open?: boolean;
		/** HTML content of the popup */
		children?: Snippet;
		// Events
		// https://maplibre.org/maplibre-gl-js/docs/API/classes/Popup/#events
		onopen?: maplibregl.Listener;
		onclose?: maplibregl.Listener;
	}
	let {
		// reactive
		lnglat,
		trackPointer,
		class: className = undefined,
		open = $bindable(),
		offset,
		maxWidth,
		subpixelPositioning,
		padding,
		//
		closeButton,
		closeOnClick,
		closeOnMove,
		focusAfterOpen,
		// Events
		onopen,
		onclose,
		// Children
		children,
		...restOptions
	}: Props = $props();

	let container = $state<HTMLElement | null>(null);

	const mapCtx = getMapContext();
	if (!mapCtx.map) throw new Error('Map instance is not initialized.');

	let popup: maplibregl.Popup | null = $state.raw(null);

	const markerContext = getMarkerContext();

	$effect(() => {
		if (popup) {
			return;
		}
		if (!mapCtx.map) throw new Error('MapLibre is not initialized');

		const options: maplibregl.PopupOptions = {
			className,
			offset,
			subpixelPositioning,
			...restOptions
		};

		maxWidth !== undefined && (options.maxWidth = maxWidth);
		padding !== undefined && (options.padding = padding);
		closeButton !== undefined && (options.closeButton = closeButton);
		closeOnClick !== undefined && (options.closeOnClick = closeOnClick);
		closeOnMove !== undefined && (options.closeOnMove = closeOnMove);
		focusAfterOpen !== undefined && (options.focusAfterOpen = focusAfterOpen);

		if (!container) throw new Error('Popup content container is not initialized');

		popup = new maplibregl.Popup(options);
		popup.setDOMContent(container);

		if (trackPointer) {
			popup.trackPointer();
			if (open === undefined) {
				open = true;
			}
		} else if (lnglat) {
			popup.setLngLat(lnglat);
			if (open === undefined) {
				open = true;
			}
		}
	});

	$effect(() => {
		if (markerContext?.marker) {
			markerContext.marker.setPopup(popup);
		}
	});

	let firstRun = true;
	let internalOpen = false;

	$effect(() => {
		if (open === true) {
			if (mapCtx.map && !internalOpen) {
				if (!trackPointer && !popup?.getLngLat()) {
					const lnglat = markerContext?.marker?.getLngLat();
					if (!lnglat) return;
					popup?.setLngLat(lnglat);
				}
				popup?.addTo(mapCtx.map);
				internalOpen = true;
			}
		} else if (open === false && internalOpen) {
			popup?.remove();
			internalOpen = false;
		}
	});

	$effect(() => {
		function _onopen(ev: unknown) {
			open = true;
			internalOpen = true;
			onopen?.(ev);
		}
		popup?.on('open', _onopen);
		return () => {
			popup?.off('open', _onopen);
		};
	});

	$effect(() => {
		function _onclose(ev: unknown) {
			open = false;
			internalOpen = false;
			onclose?.(ev);
		}
		popup?.on('close', _onclose);
		return () => {
			popup?.off('close', _onclose);
		};
	});

	$effect(() => {
		const shouldTrackPointer = trackPointer;
		const anchor = lnglat ?? markerContext?.marker?.getLngLat();
		if (firstRun || !popup) return;
		if (shouldTrackPointer) {
			popup.trackPointer();
		} else if (anchor) {
			popup.setLngLat(anchor);
		}
	});

	$effect(() => {
		maxWidth;
		if (!firstRun) {
			popup?.setMaxWidth(maxWidth ?? 'none');
		}
	});

	$effect(() => {
		offset;
		if (!firstRun) {
			popup?.setOffset(offset);
		}
	});

	$effect(() => {
		if (subpixelPositioning !== undefined && !firstRun) {
			popup?.setSubpixelPositioning(subpixelPositioning);
		}
	});

	$effect(() => {
		padding;
		if (!firstRun) {
			popup?.setPadding(padding);
		}
	});

	let prevClassNames: string[] = [];
	$effect(() => {
		const next = (className ?? '').split(/\s+/).filter(Boolean);
		if (!popup || firstRun) {
			// Initial classes are added by the Popup constructor via
			// PopupOptions.className; record them so later diffs are correct.
			prevClassNames = next;
			return;
		}
		const nextSet = new Set(next);
		for (const c of prevClassNames) {
			if (!nextSet.has(c)) popup.removeClassName(c);
		}
		const prevSet = new Set(prevClassNames);
		for (const c of next) {
			if (!prevSet.has(c)) popup.addClassName(c);
		}
		prevClassNames = next;
	});

	$effect(() => {
		firstRun = false;
	});

	onDestroy(() => {
		popup?.remove();
		markerContext?.marker?.setPopup(null);
	});
</script>

<div bind:this={container}>
	{@render children?.()}
</div>
