import maplibregl from 'maplibre-gl';

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

export function formatLngLat(target: maplibregl.LngLatLike, lnglat: maplibregl.LngLat): maplibregl.LngLatLike {
	if (Array.isArray(target)) {
		return [lnglat.lng, lnglat.lat];
	} else if ('lon' in target) {
		return { lon: lnglat.lng, lat: lnglat.lat };
	} else {
		return { lng: lnglat.lng, lat: lnglat.lat };
	}
}
