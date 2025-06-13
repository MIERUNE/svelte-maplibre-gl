import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
	plugins: [svelte()],

	build: {
		lib: {
			entry: './src/lib/index.ts',
			name: 'SvelteMaplibreContour',
			fileName: 'index'
		},
		rollupOptions: {
			external: ['svelte', 'maplibre-gl', '@watergis/maplibre-gl-terradraw'],
			output: {
				globals: {
					svelte: 'Svelte',
					'maplibre-gl': 'maplibregl',
					'@watergis/maplibre-gl-terradraw': 'MaplibreContour'
				}
			}
		}
	}
});
