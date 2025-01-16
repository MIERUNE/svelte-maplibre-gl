import type { Toc } from '$lib/components/types';

export const toc: Toc = [
	{
		title: 'Basic',
		items: {
			'/examples/plain': 'Plain Map',
			'/examples/complex': 'Complex',
			'/examples/marker-popup': 'Marker and Popup',
			'/examples/basestyle': 'Change Base Style',
			'/examples/hover-styles': 'Hover Styles',
			'/examples/clusters': 'Clusters',
			'/examples/limit-interaction': 'Limit Map Interactions',
			'/examples/animate-images': 'Animate a Series of Images',
			'/examples/video-on-a-map': 'Video on a Map',
			'/examples/fullscreen': 'Fullscreen',
			'/examples/geolocate': 'Locate the User',
			'/examples/cursor': 'Change Cursor'
		}
	},
	{
		title: 'Styles',
		items: {
			'/examples/terrain': '3D Terrain and Sky',
			'/examples/globe-atmosphere': 'Globe with an Atmosphere'
		}
	},
	{
		title: 'Utilities',
		items: {
			'/examples/image-loader': 'Load Images from URLs',
			'/examples/query-features': 'Query Features'
		}
	},
	{
		title: 'Techniques',
		items: {
			'/examples/side-by-side': 'Side by Side',
			'/examples/3d-extrusion-floorplan': '3D Floor Plan'
		}
	},
	{
		title: 'Advanced',
		items: {
			'/examples/custom-control': 'Custom Control',
			'/examples/custom-protocol': 'Custom Protocols',
			'/examples/canvas-source': 'Canvas Source',
			'/examples/custom-layer': 'Custom Layer',
			'/examples/dynamic-image': 'Dynamic Image',
			'/examples/threejs-model': '3D model with three.js'
		}
	},
	{
		title: 'Extensions',
		items: {
			'/examples/pmtiles': 'PMTiles Protocol',
			'/examples/deckgl-overlay': 'deck.gl Overlay',
			'/examples/contour': 'Contour Lines'
		}
	}
];
