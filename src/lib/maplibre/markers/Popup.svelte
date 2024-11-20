<script lang="ts">
	// https://maplibre.org/maplibre-gl-js/docs/API/classes/Popup/

	import { onDestroy, type Snippet } from 'svelte';
	import maplibregl from 'maplibre-gl';
	import { getMapContext, getMarkerContext } from '../contexts.svelte.js';
	import { resetEventListener } from '../utils.js';

	interface Props extends Omit<maplibregl.PopupOptions, 'className'> {
		lnglat?: maplibregl.LngLatLike;
		class?: string;
		/** HTML content of the popup */
		content?: Snippet;
		children?: Snippet;
		// Events
		// https://maplibre.org/maplibre-gl-js/docs/API/classes/Popup/#events
		onopen?: maplibregl.Listener;
		onclose?: maplibregl.Listener;
	}

	let container = $state<HTMLElement | null>(null);

	let {
		lnglat,
		class: className = undefined,
		offset,
		closeButton,
		closeOnClick,
		closeOnMove,
		focusAfterOpen,
		maxWidth,
		subpixelPositioning,
		onopen,
		onclose,
		children,
		...restOptions
	}: Props = $props();

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
		closeButton !== undefined && (options.closeButton = closeButton);
		closeOnClick !== undefined && (options.closeOnClick = closeOnClick);
		closeOnMove !== undefined && (options.closeOnMove = closeOnMove);
		focusAfterOpen !== undefined && (options.focusAfterOpen = focusAfterOpen);

		if (!container) throw new Error('Popup content container is not initialized');

		popup = new maplibregl.Popup(options);
		popup.setDOMContent(container);

		if (lnglat) {
			popup.setLngLat(lnglat);
			popup.addTo(mapCtx.map);
		}
	});

	$effect(() => {
		if (markerContext?.marker) {
			markerContext.marker.setPopup(popup);
		}
	});

	let firstRun = true;

	$effect(() => resetEventListener(popup, 'open', onopen));
	$effect(() => resetEventListener(popup, 'close', onclose));

	$effect(() => {
		if (lnglat && !firstRun) {
			popup?.setLngLat(lnglat);
		}
	});

	$effect(() => {
		maxWidth;
		if (!firstRun) {
			popup?.setMaxWidth(maxWidth ?? 'none');
		}
	});

	$effect(() => {
		if (offset && !firstRun) {
			popup?.setOffset(offset);
		}
	});

	$effect(() => {
		if (subpixelPositioning !== undefined && !firstRun) {
			popup?.setSubpixelPositioning(subpixelPositioning);
		}
	});

	$effect(() => {
		// TODO: differential update ?
		const classNames = (className ?? '')?.split(/\s/).filter(Boolean);
		if (popup && !firstRun) {
			for (const className of classNames) {
				popup.addClassName(className);
			}
		}
		return () => {
			if (popup) {
				for (const className of classNames) {
					popup.removeClassName(className);
				}
			}
		};
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
