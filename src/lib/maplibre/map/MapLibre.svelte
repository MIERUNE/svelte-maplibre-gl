<script lang="ts">
	// https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/

	import { onDestroy, type Snippet } from 'svelte';
	import maplibregl, { type LngLatLike } from 'maplibre-gl';
	import { prepareMapContext } from '../contexts.svelte.js';
	import { formatLngLat, resetEventListener } from '../utils.js';

	type MapEventProps = {
		[K in keyof maplibregl.MapEventType as `on${K}`]?: (ev: maplibregl.MapEventType[K]) => void;
	};

	interface Props extends Omit<maplibregl.MapOptions, 'container'>, MapEventProps {
		map?: maplibregl.Map;
		class?: string;
		/** Inline CSS `style` for the map container HTML element. Not to be confused with the map's style settings. */
		inlineStyle?: string;
		center?: LngLatLike;
		padding?: maplibregl.PaddingOptions;
		/** Vertical field of view in degrees */
		fov?: number;
		cursor?: string;
		/** Loads and applies maplibre-gl.css from a CDN. Set to false if you want to include it manually. */
		autoloadGlobalCss?: boolean;

		// Accessors
		// https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/#accessors
		showTileBoundaries?: boolean;
		showPadding?: boolean;
		showCollisionBoxes?: boolean;
		showOverdrawInspector?: boolean;
		repaint?: boolean;
		vertices?: boolean;

		// Snippets
		children?: Snippet;
	}

	let {
		map = $bindable(undefined),
		class: className = '',
		inlineStyle = '',
		children,
		autoloadGlobalCss: autoloadGlobalCss = true,

		// Events
		// https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/MapEventType/
		onerror,
		onload,
		onidle,
		onremove,
		onrender,
		onresize,
		onwebglcontextlost,
		onwebglcontextrestored,
		ondataloading,
		ondata,
		ontiledataloading,
		onsourcedataloading,
		onstyledataloading,
		onsourcedata,
		onstyledata,
		onstyleimagemissing,
		ondataabort,
		onsourcedataabort,
		onboxzoomcancel,
		onboxzoomstart,
		onboxzoomend,
		ontouchcancel,
		ontouchmove,
		ontouchend,
		ontouchstart,
		onclick,
		oncontextmenu,
		ondblclick,
		onmousemove,
		onmouseup,
		onmousedown,
		onmouseout,
		onmouseover,
		onmovestart,
		onmove,
		onmoveend,
		onzoomstart,
		onzoom,
		onzoomend,
		onrotatestart,
		onrotate,
		onrotateend,
		ondragstart,
		ondrag,
		ondragend,
		onpitchstart,
		onpitch,
		onpitchend,
		onwheel,
		onterrain,
		oncooperativegestureprevented,
		onprojectiontransition,

		// Others
		padding = { top: 0, bottom: 0, left: 0, right: 0 },
		fov,
		cursor,

		// Accessors
		showTileBoundaries,
		showPadding,
		showCollisionBoxes,
		showOverdrawInspector,
		repaint,
		vertices,

		// Map Options (reactive)
		bearing = $bindable(undefined),
		bearingSnap,
		center = $bindable(undefined),
		centerClampedToGround,
		elevation = $bindable(undefined),
		interactive = undefined,
		maxBounds,
		maxPitch,
		maxZoom,
		minPitch,
		minZoom,
		pitch = $bindable(undefined),
		pixelRatio,
		renderWorldCopies,
		roll = $bindable(undefined),
		style = { version: 8, sources: {}, layers: [] },
		transformRequest,
		zoom = $bindable(undefined),

		// Map Options (properties)
		boxZoom,
		cancelPendingTileRequestsWhileZooming,
		cooperativeGestures,
		doubleClickZoom,
		dragPan,
		dragRotate,
		keyboard,
		scrollZoom,
		touchPitch,
		touchZoomRotate,
		transformCameraUpdate,

		// Map Options (others)
		...restOptions
	}: Props = $props();

	if (autoloadGlobalCss && globalThis.window && !document.querySelector('link[href$="/maplibre-gl.css"]')) {
		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = `https://unpkg.com/maplibre-gl@${maplibregl.getVersion()}/dist/maplibre-gl.css`;
		document.head.appendChild(link);
	}

	let container: HTMLElement | undefined = $state();

	const mapCtx = prepareMapContext();

	$effect(() => {
		if (map || !container) {
			return;
		}
		const options: maplibregl.MapOptions = {
			container,
			...Object.fromEntries(
				Object.entries({
					// Map Options (reactive)
					bearing,
					bearingSnap,
					center,
					centerClampedToGround,
					elevation,
					interactive,
					maxBounds,
					maxPitch,
					maxZoom,
					minPitch,
					minZoom,
					pitch,
					pixelRatio,
					renderWorldCopies,
					roll,
					style,
					transformRequest,
					zoom,
					// Map Options (Map properties)
					boxZoom,
					cancelPendingTileRequestsWhileZooming,
					cooperativeGestures,
					doubleClickZoom,
					dragPan,
					dragRotate,
					keyboard,
					scrollZoom,
					touchPitch,
					touchZoomRotate,
					transformCameraUpdate,
					// Map Options (others)
					...restOptions

					// filter out undefined values
				}).filter(([, v]) => v !== undefined)
			)
		};

		map = new maplibregl.Map(options);
		mapCtx.map = map ?? null;

		if (cursor) {
			map.getCanvas().style.cursor = cursor ?? '';
		}

		map.on('move', () => {
			if (!map) {
				return;
			}
			const tr = map.transform;
			if (center) {
				const _center = maplibregl.LngLat.convert(center);
				if (_center.lat !== tr.center.lat || _center.lng !== tr.center.lng) {
					center = formatLngLat(center, tr.center);
				}
			} else {
				center = tr.center;
			}
			if (tr.zoom !== zoom) {
				zoom = tr.zoom;
			}
			if (tr.bearing !== bearing) {
				bearing = tr.bearing;
			}
			if (tr.pitch !== pitch) {
				pitch = tr.pitch;
			}
			if (tr.roll !== roll) {
				roll = tr.roll;
			}
			if (tr.elevation !== elevation) {
				elevation = tr.elevation;
			}
		});
	});

	// Events
	$effect(() => resetEventListener(map, 'boxzoomcancel', onboxzoomcancel));
	$effect(() => resetEventListener(map, 'boxzoomend', onboxzoomend));
	$effect(() => resetEventListener(map, 'boxzoomstart', onboxzoomstart));
	$effect(() => resetEventListener(map, 'click', onclick));
	$effect(() => resetEventListener(map, 'contextmenu', oncontextmenu));
	$effect(() => resetEventListener(map, 'cooperativegestureprevented', oncooperativegestureprevented));
	$effect(() => resetEventListener(map, 'data', ondata));
	$effect(() => resetEventListener(map, 'dataabort', ondataabort));
	$effect(() => resetEventListener(map, 'dataloading', ondataloading));
	$effect(() => resetEventListener(map, 'dblclick', ondblclick));
	$effect(() => resetEventListener(map, 'drag', ondrag));
	$effect(() => resetEventListener(map, 'dragend', ondragend));
	$effect(() => resetEventListener(map, 'dragstart', ondragstart));
	$effect(() => resetEventListener(map, 'error', onerror));
	$effect(() => resetEventListener(map, 'idle', onidle));
	$effect(() => resetEventListener(map, 'load', onload));
	$effect(() => resetEventListener(map, 'mousedown', onmousedown));
	$effect(() => resetEventListener(map, 'mousemove', onmousemove));
	$effect(() => resetEventListener(map, 'mouseout', onmouseout));
	$effect(() => resetEventListener(map, 'mouseover', onmouseover));
	$effect(() => resetEventListener(map, 'mouseup', onmouseup));
	$effect(() => resetEventListener(map, 'move', onmove));
	$effect(() => resetEventListener(map, 'moveend', onmoveend));
	$effect(() => resetEventListener(map, 'movestart', onmovestart));
	$effect(() => resetEventListener(map, 'pitch', onpitch));
	$effect(() => resetEventListener(map, 'pitchend', onpitchend));
	$effect(() => resetEventListener(map, 'pitchstart', onpitchstart));
	$effect(() => resetEventListener(map, 'projectiontransition', onprojectiontransition));
	$effect(() => resetEventListener(map, 'remove', onremove));
	$effect(() => resetEventListener(map, 'render', onrender));
	$effect(() => resetEventListener(map, 'resize', onresize));
	$effect(() => resetEventListener(map, 'rotate', onrotate));
	$effect(() => resetEventListener(map, 'rotateend', onrotateend));
	$effect(() => resetEventListener(map, 'rotatestart', onrotatestart));
	$effect(() => resetEventListener(map, 'sourcedata', onsourcedata));
	$effect(() => resetEventListener(map, 'sourcedataabort', onsourcedataabort));
	$effect(() => resetEventListener(map, 'sourcedataloading', onsourcedataloading));
	$effect(() => resetEventListener(map, 'styledata', onstyledata));
	$effect(() => resetEventListener(map, 'styledataloading', onstyledataloading));
	$effect(() => resetEventListener(map, 'styleimagemissing', onstyleimagemissing));
	$effect(() => resetEventListener(map, 'terrain', onterrain));
	$effect(() => resetEventListener(map, 'tiledataloading', ontiledataloading));
	$effect(() => resetEventListener(map, 'touchcancel', ontouchcancel));
	$effect(() => resetEventListener(map, 'touchend', ontouchend));
	$effect(() => resetEventListener(map, 'touchmove', ontouchmove));
	$effect(() => resetEventListener(map, 'touchstart', ontouchstart));
	$effect(() => resetEventListener(map, 'webglcontextlost', onwebglcontextlost));
	$effect(() => resetEventListener(map, 'webglcontextrestored', onwebglcontextrestored));
	$effect(() => resetEventListener(map, 'wheel', onwheel));
	$effect(() => resetEventListener(map, 'zoom', onzoom));
	$effect(() => resetEventListener(map, 'zoomend', onzoomend));
	$effect(() => resetEventListener(map, 'zoomstart', onzoomstart));

	let firstRun = true;

	$effect(() => {
		// TODO: differential update ?
		className;
		const classNames = (className ?? '')?.split(/\s/).filter(Boolean);
		if (container && !firstRun) {
			for (const className of classNames) {
				container.classList.add(className);
			}
		}
		return () => {
			if (container) {
				for (const className of classNames) {
					container.classList.remove(className);
				}
			}
		};
	});

	// Others
	$effect(() => {
		if (fov !== undefined) {
			map?.setVerticalFieldOfView(fov);
		}
	});
	$effect(() => {
		cursor;
		if (map && !firstRun) {
			map.getCanvas().style.cursor = cursor ?? '';
		}
	});

	// Accessors
	$effect(() => {
		if (map && showTileBoundaries !== undefined && !firstRun) {
			map.showTileBoundaries = showTileBoundaries;
		}
	});
	$effect(() => {
		if (map && showPadding !== undefined && !firstRun) {
			map.showPadding = showPadding;
		}
	});
	$effect(() => {
		if (map && showCollisionBoxes !== undefined && !firstRun) {
			map.showCollisionBoxes = showCollisionBoxes;
		}
	});
	$effect(() => {
		if (map && showOverdrawInspector !== undefined && !firstRun) {
			map.showOverdrawInspector = showOverdrawInspector;
		}
	});
	$effect(() => {
		if (map && repaint !== undefined && !firstRun) {
			map.repaint = repaint;
		}
	});
	$effect(() => {
		if (map && vertices !== undefined && !firstRun) {
			map.vertices = vertices;
		}
	});

	// Map Options (reactive)
	$effect(() => {
		center;
		zoom;
		bearing;
		pitch;
		roll;
		elevation;
		padding;
		if (!firstRun && map) {
			const tr = map._getTransformForUpdate();
			let jumpTo: maplibregl.JumpToOptions = {};
			let changed = false;

			function notAlmostEqual(a: number, b: number) {
				// The globe projection causes rounding errors, so we need to allow for a small difference
				return Math.abs(a - b) > 1e-14;
			}

			if (center) {
				const _center = maplibregl.LngLat.convert(center);
				if (notAlmostEqual(tr.center.lat, _center.lat) || notAlmostEqual(tr.center.lng, _center.lng)) {
					jumpTo.center = center;
					changed = true;
				}
			}
			if (zoom !== undefined && notAlmostEqual(tr.zoom, zoom)) {
				jumpTo.zoom = zoom;
				changed = true;
			}
			if (bearing !== undefined && notAlmostEqual(tr.bearing, bearing)) {
				jumpTo.bearing = bearing;
				changed = true;
			}
			if (pitch !== undefined && tr.pitch !== pitch) {
				jumpTo.pitch = pitch;
				changed = true;
			}
			if (roll !== undefined && tr.roll !== roll) {
				jumpTo.roll = roll;
				changed = true;
			}
			if (elevation !== undefined && tr.elevation !== elevation) {
				jumpTo.elevation = elevation;
				changed = true;
			}
			if (padding && !tr.isPaddingEqual(padding)) {
				jumpTo.padding = padding;
				changed = true;
			}

			if (changed) {
				// Temporarily replace `stop` with `_stop(allowGestures: true)` to allow ongoing gestures during `jumpTo`,
				const originalStop = map.stop;
				map.stop = () => map!._stop(true);
				map?.jumpTo(jumpTo, { reactivity: true });
				map.stop = originalStop;
			}
		}
	});
	$effect(() => {
		bearingSnap;
		if (map && bearingSnap && !firstRun) {
			map._bearingSnap = bearingSnap;
		}
	});
	$effect(() => {
		centerClampedToGround;
		if (!firstRun) {
			map?.setCenterClampedToGround(centerClampedToGround ?? false);
		}
	});
	$effect(() => {
		maxBounds;
		if (!firstRun) {
			map?.setMaxBounds(maxBounds);
		}
	});
	$effect(() => {
		maxPitch;
		if (!firstRun) {
			map?.setMaxPitch(maxPitch);
		}
	});
	$effect(() => {
		maxZoom;
		if (!firstRun) {
			map?.setMaxZoom(maxZoom);
		}
	});
	$effect(() => {
		minPitch;
		if (!firstRun) {
			map?.setMinPitch(minPitch);
		}
	});
	$effect(() => {
		minZoom;
		if (!firstRun) {
			map?.setMinZoom(minZoom);
		}
	});
	$effect(() => {
		pixelRatio;
		if (!firstRun) {
			map?.setPixelRatio(pixelRatio ?? (null as unknown as number));
		}
	});
	$effect(() => {
		renderWorldCopies;
		if (!firstRun) {
			map?.setRenderWorldCopies(renderWorldCopies ?? null);
		}
	});
	$effect(() => {
		if (style && !firstRun) {
			mapCtx.setStyle(style);
		}
	});
	$effect(() => {
		transformRequest;
		if (!firstRun) {
			map?.setTransformRequest(transformRequest as maplibregl.RequestTransformFunction);
		}
	});

	// Map Options (Map properties)
	$effect(() => {
		if (boxZoom !== undefined && !firstRun) {
			boxZoom ? map?.boxZoom.enable() : map?.boxZoom.disable();
		}
	});
	$effect(() => {
		if (map && cancelPendingTileRequestsWhileZooming !== undefined && !firstRun) {
			map.cancelPendingTileRequestsWhileZooming = cancelPendingTileRequestsWhileZooming;
		}
	});
	$effect(() => {
		if (cooperativeGestures !== undefined && !firstRun) {
			cooperativeGestures ? map?.cooperativeGestures.enable() : map?.cooperativeGestures.disable();
		}
	});
	$effect(() => {
		if (doubleClickZoom !== undefined && !firstRun) {
			doubleClickZoom ? map?.doubleClickZoom.enable() : map?.doubleClickZoom.disable();
		}
	});
	$effect(() => {
		if (dragPan !== undefined && !firstRun) {
			dragPan ? map?.dragPan.enable(dragPan) : map?.dragPan.disable();
		}
	});
	$effect(() => {
		if (dragRotate !== undefined && !firstRun) {
			dragRotate ? map?.dragRotate.enable() : map?.dragRotate.disable();
		}
	});
	$effect(() => {
		if (keyboard !== undefined && !firstRun) {
			keyboard ? map?.keyboard.enable() : map?.keyboard.disable();
		}
	});
	$effect(() => {
		if (scrollZoom !== undefined && !firstRun) {
			scrollZoom ? map?.scrollZoom.enable(scrollZoom) : map?.scrollZoom.disable();
		}
	});
	$effect(() => {
		if (touchPitch !== undefined && !firstRun) {
			touchPitch ? map?.touchPitch.enable(touchPitch) : map?.touchPitch.disable();
		}
	});
	$effect(() => {
		if (touchZoomRotate !== undefined && !firstRun) {
			touchZoomRotate ? map?.touchZoomRotate.enable(touchZoomRotate) : map?.touchZoomRotate.disable();
		}
	});
	$effect(() => {
		transformCameraUpdate;
		if (map && !firstRun) {
			map.transformCameraUpdate = transformCameraUpdate ?? null;
		}
	});

	$effect(() => {
		firstRun = false;
	});

	onDestroy(() => {
		mapCtx.map = null;
		map?.remove();
		map = undefined;
	});
</script>

<div class={className} style={inlineStyle} bind:this={container}>
	{#if map}
		{@render children?.()}
	{/if}
</div>
