<script lang="ts">
	// https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/

	import { onDestroy, untrack, type Snippet } from 'svelte';
	import * as maplibregl from 'maplibre-gl';
	import { prepareMapContext } from '../contexts.svelte.js';
	import { formatLngLat, resetEventListener } from '../utils.js';

	type RollEvent = maplibregl.MapLibreEvent<MouseEvent | TouchEvent | undefined>;
	type RollEventType = {
		rollstart: RollEvent;
		roll: RollEvent;
		rollend: RollEvent;
	};
	type SupportedMapEventType = maplibregl.MapEventType & RollEventType;
	type MapEventName = keyof SupportedMapEventType;
	type MapEventHandlerName = `on${MapEventName}`;
	type MapEventProps = {
		[K in keyof SupportedMapEventType as `on${K}`]?: (ev: SupportedMapEventType[K]) => void;
	};

	const mapEventNames = [
		'boxzoomcancel',
		'boxzoomend',
		'boxzoomstart',
		'click',
		'contextmenu',
		'cooperativegestureprevented',
		'data',
		'dataabort',
		'dataloading',
		'dblclick',
		'drag',
		'dragend',
		'dragstart',
		'error',
		'idle',
		'load',
		'mousedown',
		'mousemove',
		'mouseout',
		'mouseover',
		'mouseup',
		'move',
		'moveend',
		'movestart',
		'pitch',
		'pitchend',
		'pitchstart',
		'projectiontransition',
		'remove',
		'render',
		'resize',
		'rotate',
		'rotateend',
		'rotatestart',
		'rollstart',
		'roll',
		'rollend',
		'sourcedata',
		'sourcedataabort',
		'sourcedataloading',
		'styledata',
		'styledataloading',
		'styleimagemissing',
		'terrain',
		'tiledataloading',
		'touchcancel',
		'touchend',
		'touchmove',
		'touchstart',
		'webglcontextlost',
		'webglcontextrestored',
		'wheel',
		'zoom',
		'zoomend',
		'zoomstart'
	] as const satisfies readonly MapEventName[];

	type Assert<T extends true> = T;
	type MissingMapEventName = Exclude<MapEventName, (typeof mapEventNames)[number]>;
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type _MapEventNamesAreExhaustive = Assert<MissingMapEventName extends never ? true : false>;

	const mapEventNameSet = new Set<string>(mapEventNames);

	function isMapEventHandlerName(name: string): name is MapEventHandlerName {
		return name.startsWith('on') && mapEventNameSet.has(name.slice(2));
	}

	interface Props extends Omit<maplibregl.MapOptions, 'container'>, MapEventProps {
		/**
		 * You can access the internal MapLibre GL `Map` instance by binding a variable to this prop.
		 *
		 * This allows you to directly interact with the underlying Map instance, enabling imperative API calls.
		 */
		map?: maplibregl.Map;
		class?: string;
		/** Inline CSS `style` for the map container HTML element. Not to be confused with the map's style settings. */
		inlineStyle?: string;
		/** The padding in pixels around the viewport */
		padding?: maplibregl.PaddingOptions;
		/** Vertical field of view in degrees */
		fov?: number;
		/** Cursor style for the map canvas */
		cursor?: string;
		/** Loads and applies maplibre-gl.css from a CDN. Set to false if you want to include it manually. */
		autoloadGlobalCss?: boolean;

		// Accessors
		// https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/#accessors
		/** Whether the map will render an outline around each tile and the tile ID. These tile boundaries are useful for debugging. */
		showTileBoundaries?: boolean;
		/** Whether the map will visualize the padding offsets. */
		showPadding?: boolean;
		/** Whether the map will visualize the padding offsets. */
		showCollisionBoxes?: boolean;
		/** Whether the map will render boxes around all symbols in the data source */
		showOverdrawInspector?: boolean;
		/** Whether the map will continuously repaint. This information is useful for analyzing performance. */
		repaint?: boolean;
		vertices?: boolean;

		// Global state
		globalState?: Record<string, unknown>;

		// Snippets
		children?: Snippet<[maplibregl.Map]>;
	}

	let {
		map = $bindable(undefined),
		class: className = '',
		inlineStyle = '',
		children,
		autoloadGlobalCss: autoloadCss = true,

		// Others
		padding = $bindable(undefined),
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
		zoomSnap,
		anisotropicFilterPitch,
		transformConstrain,

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

		// Global state
		globalState = {},

		// Map Options (others)
		...restOptions
	}: Props = $props();
	const initialClassName = untrack(() => className);

	$effect(() => {
		if (autoloadCss && globalThis.window && !document.querySelector('link[href$="/maplibre-gl.css"]')) {
			const link = document.createElement('link');
			link.rel = 'stylesheet';
			link.href = `https://unpkg.com/maplibre-gl@${maplibregl.getVersion()}/dist/maplibre-gl.css`;
			document.head.appendChild(link);
		}
	});

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
					zoomSnap,
					anisotropicFilterPitch,
					transformConstrain,
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
				}).filter(([k, v]) => v !== undefined && !isMapEventHandlerName(k))
			)
		};

		map = new maplibregl.Map(options);
		mapCtx.map = map ?? null;

		if (padding !== undefined) {
			map.setPadding(padding);
		}
		if (cursor) {
			map.getCanvas().style.cursor = cursor;
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
			if (padding && !tr.isPaddingEqual(padding)) {
				padding = map.getPadding();
			}
		});
	});

	let prevGlobalState = new Map<string, unknown>();
	$effect(() => {
		if (!mapCtx.map) {
			return;
		}

		const nextEntries = Object.entries($state.snapshot(globalState) as Record<string, unknown>);
		const nextKeys = new Set(nextEntries.map(([key]) => key));
		const abortController = new AbortController();

		mapCtx.waitForStyleLoaded(
			(map) => {
				for (const key of prevGlobalState.keys()) {
					if (!nextKeys.has(key)) {
						map.setGlobalStateProperty(key, null);
					}
				}
				for (const [key, value] of nextEntries) {
					if (!prevGlobalState.has(key) || prevGlobalState.get(key) !== value) {
						map.setGlobalStateProperty(key, value);
					}
				}
				prevGlobalState = new Map(nextEntries);
			},
			{ signal: abortController.signal }
		);

		return () => abortController.abort();
	});

	// Events
	function registerMapEventListener(type: MapEventName) {
		$effect(() =>
			resetEventListener(map, type, restOptions[`on${type}` as MapEventHandlerName] as maplibregl.Listener | undefined)
		);
	}
	mapEventNames.forEach(registerMapEventListener);

	let firstRun = true;

	let prevClassNames = initialClassName.split(/\s+/).filter(Boolean);
	$effect(() => {
		const next = (className ?? '').split(/\s+/).filter(Boolean);
		if (!container || firstRun) {
			prevClassNames = next;
			return;
		}

		const nextSet = new Set(next);
		for (const className of prevClassNames) {
			if (!nextSet.has(className)) container.classList.remove(className);
		}

		const prevSet = new Set(prevClassNames);
		for (const className of next) {
			if (!prevSet.has(className)) container.classList.add(className);
		}

		prevClassNames = next;
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
				const currentMap = map;
				// Temporarily replace `stop` with `_stop(allowGestures: true)` to allow ongoing gestures during `jumpTo`,
				const originalStop = currentMap.stop;
				currentMap.stop = () => currentMap._stop(true);
				currentMap.jumpTo(jumpTo, { reactivity: true });
				currentMap.stop = originalStop;
			}
		}
	});
	$effect(() => {
		bearingSnap;
		if (map && bearingSnap !== undefined && !firstRun) {
			map._bearingSnap = bearingSnap;
		}
	});
	$effect(() => {
		zoomSnap;
		if (map && zoomSnap !== undefined && !firstRun && map.getZoomSnap() !== zoomSnap) {
			map.setZoomSnap(zoomSnap);
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
		if (!firstRun && pixelRatio !== undefined) {
			map?.setPixelRatio(pixelRatio);
		}
	});
	$effect(() => {
		renderWorldCopies;
		if (!firstRun) {
			map?.setRenderWorldCopies(renderWorldCopies ?? null);
		}
	});
	$effect(() => {
		style;
		if (!firstRun) {
			mapCtx.setStyle(style);
		}
	});
	$effect(() => {
		transformRequest;
		if (!firstRun) {
			map?.setTransformRequest(transformRequest as maplibregl.RequestTransformFunction);
		}
	});
	$effect(() => {
		transformConstrain;
		if (map && !firstRun) {
			map.setTransformConstrain(transformConstrain ?? null);
		}
	});
	$effect(() => {
		anisotropicFilterPitch;
		if (map && !firstRun) {
			map.setAnisotropicFilterPitch(anisotropicFilterPitch ?? null);
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

<div class={initialClassName} style={inlineStyle} bind:this={container}>
	{#if map}
		{@render children?.(map)}
	{/if}
</div>
