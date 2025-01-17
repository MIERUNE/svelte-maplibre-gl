import type {
	Map as MapLibre,
	Marker,
	AddLayerObject,
	SourceSpecification,
	CanvasSourceSpecification,
	StyleSpecification,
	SkySpecification,
	TerrainSpecification,
	ProjectionSpecification,
	LightSpecification
} from 'maplibre-gl';
import { setContext, getContext } from 'svelte';

const MAP_CONTEXT_KEY = Symbol('MapLibre map context');
const SOURCE_CONTEXT_KEY = Symbol('MapLibre source context');
const LAYER_CONTEXT_KEY = Symbol('MapLibre layer context');
const MARKER_CONTEXT_KEY = Symbol('MapLibre marker context');

// https://svelte.dev/docs/svelte/$state#Classes
class MapContext {
	/** Map instance */
	_map: MapLibre | null = $state.raw(null);
	/** Callbacks to be called when the map style is loaded */
	private _listener?: maplibregl.Listener = undefined;
	private _pending: ((map: maplibregl.Map) => void)[] = [];
	/** Names of layers dynamically added */
	userLayers: Set<string> = new Set();
	/** Names of sources dynamically added */
	userSources: Set<string> = new Set();
	/** Terrain specification of the current base style */
	baseTerrain?: TerrainSpecification | undefined;
	/** Sky specification set by user */
	userTerrain?: TerrainSpecification | undefined;
	/** Sky specification of the current base style */
	baseSky?: SkySpecification | undefined;
	/** Sky specification set by user */
	userSky?: SkySpecification | undefined;
	/** Light specification of the current base style */
	baseLight?: LightSpecification | undefined;
	/** Light specification set by user */
	userLight?: LightSpecification | undefined;
	/** Projection specification of the current base style */
	baseProjection?: ProjectionSpecification | undefined;
	/** Projection specification set by user */
	userProjection?: ProjectionSpecification | undefined;

	get map() {
		return this._map;
	}

	set map(value: maplibregl.Map | null) {
		if (this._listener) {
			this._map?.off('styledata', this._listener);
			this._listener = undefined;
		}
		this._map = value;
		if (this._map) {
			this._listener = this._onstyledata.bind(this);
			this._map.on('styledata', this._listener);
		}
	}

	addLayer(addLayerObject: AddLayerObject, beforeId?: string) {
		if (!this.map) throw new Error('Map is not initialized');
		this.userLayers.add(addLayerObject.id);
		this.waitForStyleLoaded((map) => {
			map.addLayer(addLayerObject, beforeId);
		});
	}
	removeLayer(id: string) {
		if (!this.map) throw new Error('Map is not initialized');
		this.userLayers.delete(id);
		this.waitForStyleLoaded((map) => {
			map.removeLayer(id);
		});
	}

	addSource(id: string, source: SourceSpecification | CanvasSourceSpecification) {
		this.userSources.add(id);
		this.waitForStyleLoaded((map) => {
			map.addSource(id, source);
		});
	}
	removeSource(id: string) {
		this.userSources.delete(id);
		this.waitForStyleLoaded((map) => {
			map.removeSource(id);
		});
	}

	/** Wait for the style to be loaded before calling the function */
	waitForStyleLoaded(func: (map: maplibregl.Map) => void) {
		if (!this.map) {
			return;
		}
		if (this.map.style._loaded) {
			// style is already loaded
			func(this.map);
		} else {
			// we need to wait the style to be loaded
			this._pending.push(func);
		}
	}

	private _onstyledata(ev: maplibregl.MapStyleDataEvent) {
		const map = ev.target;
		if (map?.style._loaded) {
			for (const func of this._pending) {
				// call pending tasks
				func(map);
			}
			this._pending = [];
		}
	}

	setStyle(style: string | StyleSpecification | null) {
		const { userSources: addedSources, userLayers: addedLayers } = this;
		if (!style) {
			this.map?.setStyle(null);
			return;
		}

		this.map?.setStyle($state.snapshot(style) as string | StyleSpecification, {
			// Preserves user styles when the base style changes
			transformStyle: (previous, next) => {
				this.baseLight = next.light;
				this.baseProjection = next.projection;
				this.baseSky = next.sky;
				this.baseTerrain = next.terrain;

				if (!previous) {
					return next;
				}

				const sources = next.sources;
				for (const [key, value] of Object.entries(previous.sources!)) {
					if (addedSources.has(key)) {
						sources[key] = value;
					}
				}

				const userLayers = previous.layers!.filter((layer) => addedLayers.has(layer.id));
				const layers = [...next.layers!, ...userLayers];

				return {
					...next,
					light: this.userLight || this.baseLight,
					projection: this.userProjection || this.baseProjection,
					sky: this.userSky || this.baseSky,
					terrain: this.userTerrain || this.baseTerrain,
					sources,
					layers
				};
			}
		});
	}
}

export function prepareMapContext(): MapContext {
	const mapCtx = new MapContext();
	setContext(MAP_CONTEXT_KEY, mapCtx);
	return mapCtx;
}

export function getMapContext(): MapContext {
	const mapCtx = getContext<MapContext>(MAP_CONTEXT_KEY);
	if (!mapCtx) throw new Error('Map context not found');
	return mapCtx;
}

// https://svelte.dev/docs/svelte/$state#Classes
class SourceContext {
	/** sourceId */
	id: string = $state('');
}

export function prepareSourceContext(): SourceContext {
	const sourceCtx = new SourceContext();
	setContext(SOURCE_CONTEXT_KEY, sourceCtx);
	return sourceCtx;
}

export function getSourceContext(): SourceContext {
	const sourceCtx = getContext<SourceContext>(SOURCE_CONTEXT_KEY);
	if (!sourceCtx || !sourceCtx.id) throw new Error('Source context not found');
	return sourceCtx;
}

class LayerContext {
	id: string = $state('');
}

export function prepareLayerContext(): LayerContext {
	const layerCtx = new LayerContext();
	setContext(LAYER_CONTEXT_KEY, layerCtx);
	return layerCtx;
}

export function getLayerContext(): LayerContext | null {
	const layerCtx = getContext<LayerContext>(LAYER_CONTEXT_KEY);
	if (!layerCtx || !layerCtx.id) throw new Error('Layer context not found');
	return layerCtx;
}

class MarkerContext {
	marker: Marker | null = $state.raw(null);
}

export function prepareMarkerContext(): MarkerContext {
	const markerCtx = new MarkerContext();
	setContext(MARKER_CONTEXT_KEY, markerCtx);
	return markerCtx;
}

export function getMarkerContext(): MarkerContext | null {
	const markerCtx = getContext<MarkerContext>(MARKER_CONTEXT_KEY);
	if (!markerCtx) {
		return null;
	}
	return markerCtx;
}
