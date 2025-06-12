import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
	plugins: [svelte()],

	build: {
		lib: {
			entry: './src/lib/index.ts',
			name: 'SvelteMaplibrePMTiles',
			fileName: 'index'
		},
		rollupOptions: {
			external: ['svelte', 'maplibre-gl', 'pmtiles', 'svelte-maplibre-gl'],
			output: {
				globals: {
					svelte: 'Svelte',
					'maplibre-gl': 'maplibregl',
					pmtiles: 'pmtiles',
					'svelte-maplibre-gl': 'SvelteMaplibreGL'
				}
			}
		}
	}
});
