import type {
	AddLayerObject,
	CanvasSourceSpecification,
	LightSpecification,
	Map as MapLibre,
	Marker,
	ProjectionSpecification,
	SkySpecification,
	SourceSpecification,
	StyleSpecification,
	TerrainSpecification
} from 'maplibre-gl';
import { getContext, setContext } from 'svelte';
import { SvelteSet } from 'svelte/reactivity';

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
	userLayers = new SvelteSet<string>();
	/** Names of sources dynamically added */
	userSources = new SvelteSet<string>();
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

	/**
	 * Adds an invisible placeholder layer with a given id.
	 * The placeholder layer can be used to reserve a position
	 * for a layer while its source is still loading. Replace
	 * a placeholder layer with `replaceLayer()`.
	 */
	addPlaceholderLayer(id: string, beforeId?: string) {
		this.addLayer({ type: 'background', id, layout: { visibility: 'none' } }, beforeId);
	}

	/**
	 * Removes the current layer with a given id and adds a new layer
	 * in the same position. The new layer may declare a different id.
	 */
	replaceLayer(id: string, addLayerObject: AddLayerObject) {
		if (!this.map) throw new Error('Map is not initialized');
		this.waitForStyleLoaded((map) => {
			// find the current layer position so we can remove and
			// re-add the layer at the same position
			const layersOrder = map.getLayersOrder();
			const index = layersOrder.indexOf(id);
			if (index === -1) {
				throw new Error(`Layer with id ${id} not found`);
			}
			this.removeLayer(id);
			const beforeId = layersOrder[index + 1];
			this.addLayer(addLayerObject, beforeId);
		});
	}

	addSource(id: string, source: SourceSpecification | CanvasSourceSpecification) {
		this.userSources.add(id);
		this.waitForStyleLoaded((map) => {
			map.addSource(id, source);
		});
	}

	/**
	 * Removes an existing source by id.
	 * If the source does not exist, a warning is logged to the browser console.
	 */
	removeSource(id: string) {
		this.userSources.delete(id);
		this.waitForStyleLoaded((map) => {
			try {
				map.removeSource(id);
			} catch (error) {
				const message = error instanceof Error ? error.message : String(error);
				console.warn(`Could not remove source '${id}':`, message);
			}
		});
	}

	/**
	 * Waits for the style to be loaded before calling the function.
	 *
	 * If an abort signal is provided, the function call will be cancelled
	 * if the signal is aborted before the style is loaded.
	 */
	waitForStyleLoaded(func: (map: maplibregl.Map) => void, { signal }: { signal?: AbortSignal } = {}) {
		if (signal?.aborted) {
			return;
		}

		if (!this.map) {
			return;
		}

		if (this.map.style._loaded) {
			// style is already loaded
			func(this.map);
			return;
		}

		// we need to wait the style to be loaded
		this._pending.push(func);

		// cancel the pending function if the signal is aborted
		signal?.addEventListener('abort', () => {
			this._pending = this._pending.filter((f) => f !== func);
		});
	}

	/**
	 * Waits for a source to be loaded before calling the function.
	 *
	 * If a source is already loaded, the function is called immediately.
	 *
	 * If the source is not yet loaded, the function will be called once
	 * the `sourcedata` or `error` event is fired for the source.
	 *
	 * If an abort signal is provided, the function call will be cancelled
	 * if the signal is aborted before the source is loaded.
	 *
	 * @param sourceId The id of the source that is registered or will be registered with the map.
	 * @param func A callback function that takes the map and an error (if any).
	 */
	waitForSourceLoaded(
		sourceId: string,
		func: (map: maplibregl.Map, error: unknown | null) => void,
		{ signal }: { signal?: AbortSignal } = {}
	) {
		this.waitForStyleLoaded(
			(map) => {
				if (signal?.aborted) {
					return;
				}

				const source = map.getSource(sourceId);

				if (source && map.isSourceLoaded(sourceId)) {
					func(map, null);
				}

				// if the source does not already exist, we need to add a listener to the map
				// so we can call the function once the source loads or fails to load

				/**
				 * Listens for a source data loading event, which indicates that
				 * a source has just been added to the map and is starting to load data.
				 *
				 * This event is always followed by a `sourcedata`, `sourcedataabort`,
				 * or `error` event. We listen for the `sourcedata` and `error` events
				 * after receiving this event to determine whether the source has
				 * been loaded. Source data abort events will fire if the source
				 * is reloaded before it finishes loading, but the source will always
				 * eventually either load successfully or encounter an error.
				 */
				const handleSourceDataLoading = (event: maplibregl.MapEventType['sourcedataloading']) => {
					if (event.sourceId !== sourceId) {
						return;
					}

					map.off('sourcedataloading', handleSourceDataLoading);
				};

				const handleSourceData = (event: maplibregl.MapEventType['sourcedata']) => {
					if (event.sourceId !== sourceId || !event.isSourceLoaded) {
						return;
					}

					cleanup();
					func(map, null);
				};

				const handleSourceError = (event: maplibregl.MapEventType['error']) => {
					if (!('sourceId' in event) || event.sourceId !== sourceId) {
						return;
					}

					cleanup();
					func(map, event.error);
				};

				let timeoutId: number | null = null;
				const cleanup = () => {
					map.off('sourcedataloading', handleSourceDataLoading);
					map.off('sourcedata', handleSourceData);
					map.off('error', handleSourceError);
					if (timeoutId !== null) {
						clearTimeout(timeoutId);
						timeoutId = null;
					}
				};

				map.on('sourcedataloading', handleSourceDataLoading);
				map.on('sourcedata', handleSourceData);
				map.on('error', handleSourceError);

				// required for when a source loads after our check for
				// whether the source is loaded but before the event
				// listeners are attached
				timeoutId = setTimeout(() => {
					const source = map.getSource(sourceId);
					if (source && map.isSourceLoaded(sourceId)) {
						func(map, null);
						cleanup();
					}
				}, 100) as unknown as number;

				// cancel the event listeners if the signal is aborted
				signal?.addEventListener('abort', () => {
					cleanup();
				});
			},
			{ signal }
		);
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
