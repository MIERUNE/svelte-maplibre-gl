import type { Toc } from '$lib/components/types';

export const toc: Toc = [
	{
		title: 'Map',
		items: {
			'/docs/components/MapLibre': 'MapLibre',
			'/docs/components/Image': 'Image',
			'/docs/components/Light': 'Light',
			'/docs/components/Projection': 'Projection',
			'/docs/components/Sky': 'Sky',
			'/docs/components/Sprite': 'Sprite',
			'/docs/components/Terrain': 'Terrain'
		}
	},
	{
		title: 'Sources',
		items: {
			'/docs/components/CanvasSource': 'CanvasSource',
			'/docs/components/FeatureState': 'FeatureState',
			'/docs/components/GeoJSONSource': 'GeoJSONSource',
			'/docs/components/ImageSource': 'ImageSource',
			'/docs/components/RasterDEMTileSource': 'RasterDEMTileSource',
			'/docs/components/RasterTileSource': 'RasterTileSource',
			'/docs/components/RawSource': 'RawSource',
			'/docs/components/VectorTileSource': 'VectorTileSource',
			'/docs/components/VideoSource': 'VideoSource',
			'/docs/components/MapLibreContourSource': 'MapLibreContourSource (ext)'
		}
	},
	{
		title: 'Layers',
		items: {
			'/docs/components/BackgroundLayer': 'BackgroundLayer',
			'/docs/components/CircleLayer': 'CircleLayer',
			'/docs/components/CustomLayer': 'CustomLayer',
			'/docs/components/FillExtrusionLayer': 'FillExtrusionLayer',
			'/docs/components/HeatmapLayer': 'HeatmapLayer',
			'/docs/components/HillshadeLayer': 'HillshadeLayer',
			'/docs/components/LineLayer': 'LineLayer',
			'/docs/components/RasterLayer': 'RasterLayer',
			'/docs/components/RawLayer': 'RawLayer',
			'/docs/components/SymbolLayer': 'SymbolLayer'
		}
	},
	{
		title: 'Global',
		items: {
			'/docs/components/Protocol': 'Protocol',
			'/docs/components/PMTilesProtocol': 'PMTilesProtocol (ext)'
		}
	},
	{
		title: 'Marker',
		items: {
			'/docs/components/Marker': 'Marker',
			'/docs/components/Popup': 'Popup'
		}
	},
	{
		title: 'Controls',
		items: {
			'/docs/components/AttributionControl': 'AttributionControl',
			'/docs/components/CustomControl': 'CustomControl',
			'/docs/components/FullScreenControl': 'FullScreenControl',
			'/docs/components/GeolocateControl': 'GeolocateControl',
			'/docs/components/GlobeControl': 'GlobeControl',
			'/docs/components/Hash': 'Hash',
			'/docs/components/LogoControl': 'LogoControl',
			'/docs/components/NavigationControl': 'NavigationControl',
			'/docs/components/ScaleControl': 'ScaleControl',
			'/docs/components/TerrainControl': 'TerrainControl',
			'/docs/components/DeckGLOverlay': 'DeckGLOverlay (ext)'
		}
	},
	{
		title: 'Utilities',
		items: {
			'/docs/components/ImageLoader': 'ImageLoader',
			'/docs/components/QueryRenderedFeatures': 'QueryRenderedFeatures',
			'/docs/components/QuerySourceFeatures': 'QuerySourceFeatures'
		}
	}
];
