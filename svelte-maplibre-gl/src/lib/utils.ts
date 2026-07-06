import type * as maplibregl from 'maplibre-gl';

let layerIdCounter = 0;
let sourceIdCounter = 0;

export function generateLayerID() {
	return `svmlgl-layer-${layerIdCounter++}`;
}

export function generateSourceID() {
	return `svmlgl-source-${sourceIdCounter++}`;
}

/**
 * Set an event listener on an Evented object, and return a function that will remove the listener.
 *
 * Intended to be used within the $effect rune.
 */
export function resetEventListener(
	evented: maplibregl.Evented | null | undefined,
	type: string,
	listener: maplibregl.Listener | undefined
) {
	if (listener) {
		evented?.on(type, listener);
	}
	const prevListener = listener;
	return () => {
		if (prevListener) {
			evented?.off(type, prevListener);
		}
	};
}

/**
 * Set a Layer event listener on the Map object, and return a function that will remove the listener.
 *
 * Intended to be used within the $effect rune.
 */
export function resetLayerEventListener(
	map: maplibregl.Map | null,
	type: keyof maplibregl.MapLayerEventType,
	layer: string,
	listener: maplibregl.Listener | undefined
) {
	if (listener) {
		map?.on(type, layer, listener);
	}
	const prevListener = listener;
	return () => {
		if (prevListener) {
			map?.off(type, layer, prevListener);
		}
	};
}

/**
 * Minimal view of MapLibre's internal camera transform that our reactive
 * bindings read from.
 */
interface CameraTransform {
	center: maplibregl.LngLat;
	zoom: number;
	bearing: number;
	pitch: number;
	roll: number;
	elevation: number;
	isPaddingEqual(padding: maplibregl.PaddingOptions): boolean;
}

/**
 * The object that holds MapLibre's internal camera state.
 *
 * - MapLibre 5.x: `Map extends Camera`, so these members live directly on `map`.
 * - MapLibre 6.x: `Map` owns a separate `Camera` at `map._camera` and delegates camera methods to it.
 */
interface MapCamera {
	transform: CameraTransform;
	transformCameraUpdate: maplibregl.CameraUpdateTransformFunction | null;
	getTransformForUpdate?: () => CameraTransform;
	_getTransformForUpdate?: () => CameraTransform;
	stop: () => unknown;
	_stop: (allowGestures?: boolean) => unknown;
	_bearingSnap: number;
}

/**
 * Returns whichever object actually carries MapLibre's internal camera state,
 * so the same call sites work on both MapLibre 5.x and 6.x. See {@link MapCamera}.
 */
export function getCamera(map: maplibregl.Map): MapCamera {
	const m = map as unknown as { _camera?: MapCamera };
	return m._camera ?? (m as unknown as MapCamera);
}

/**
 * Reads the pending "desired state" camera transform, bridging the 5.x
 * `_getTransformForUpdate()` / 6.x `getTransformForUpdate()` rename.
 */
export function getUpdateTransform(camera: MapCamera): CameraTransform {
	const resolve = camera.getTransformForUpdate ?? camera._getTransformForUpdate;
	if (!resolve) {
		throw new Error(
			'svelte-maplibre-gl: neither getTransformForUpdate nor _getTransformForUpdate is available on the map camera'
		);
	}
	return resolve.call(camera);
}

export function setTransformCameraUpdate(map: maplibregl.Map, value: maplibregl.CameraUpdateTransformFunction | null) {
	const m = map as maplibregl.Map & {
		setTransformCameraUpdate?: (value: maplibregl.CameraUpdateTransformFunction | null) => void;
	};
	if (m.setTransformCameraUpdate) {
		m.setTransformCameraUpdate(value);
	} else {
		getCamera(map).transformCameraUpdate = value;
	}
}

export function formatLngLat(target: maplibregl.LngLatLike, lnglat: maplibregl.LngLat): maplibregl.LngLatLike {
	if (Array.isArray(target)) {
		return [lnglat.lng, lnglat.lat];
	} else if ('lon' in target) {
		return { lon: lnglat.lng, lat: lnglat.lat };
	} else {
		return { lng: lnglat.lng, lat: lnglat.lat };
	}
}
