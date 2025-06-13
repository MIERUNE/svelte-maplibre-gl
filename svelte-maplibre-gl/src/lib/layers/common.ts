import maplibregl from 'maplibre-gl';

export type MapLayerEventProps = {
	[K in keyof maplibregl.MapLayerEventType as `on${K}`]?: (ev: maplibregl.MapLayerEventType[K]) => void;
};
