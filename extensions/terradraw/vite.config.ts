import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
	plugins: [svelte()],

	build: {
		lib: {
			entry: './src/lib/index.ts',
			name: 'SvelteMaplibreTerraDraw',
			fileName: 'index'
		},
		rollupOptions: {
			external: ['svelte', 'maplibre-gl', 'terra-draw', 'terra-draw-maplibre-gl-adapter', 'svelte-maplibre-gl'],
			output: {
				globals: {
					svelte: 'Svelte',
					'maplibre-gl': 'maplibregl',
					'terra-draw': 'TerraDraw',
					'terra-draw-maplibre-gl-adapter': 'TerraDrawMapLibreGLAdapter',
					'svelte-maplibre-gl': 'SvelteMaplibreGL'
				}
			}
		}
	}
});
