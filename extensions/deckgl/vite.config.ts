import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
	plugins: [svelte()],

	build: {
		lib: {
			entry: './src/lib/index.ts',
			name: 'SvelteMaplibreDeckGL',
			fileName: 'index'
		},
		rollupOptions: {
			external: ['svelte', 'maplibre-gl', '@deck.gl/mapbox'],
			output: {
				globals: {
					svelte: 'Svelte',
					'maplibre-gl': 'maplibregl',
					'@deck.gl/mapbox': 'DeckGLMapbox'
				}
			}
		}
	}
});
