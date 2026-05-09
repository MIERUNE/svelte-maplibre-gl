import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { createRequire } from 'node:module';
import { searchForWorkspaceRoot } from 'vite';
// import svelteDocgenPlugin from 'vite-plugin-svelte-docgen';
import { defineConfig } from 'vitest/config';

const require = createRequire(import.meta.url);
const maplibrePkg: unknown = require('maplibre-gl/package.json');
const maplibreVersion =
	typeof maplibrePkg === 'object' &&
	maplibrePkg !== null &&
	'version' in maplibrePkg &&
	typeof (maplibrePkg as { version: unknown }).version === 'string'
		? (maplibrePkg as { version: string }).version
		: '0';
const maplibreMajorSegment = maplibreVersion.split('.')[0]?.replace(/^\D+/, '') ?? '';
const parsedMaplibreMajor = Number.parseInt(maplibreMajorSegment, 10);
const maplibreMajor = Number.isFinite(parsedMaplibreMajor) ? parsedMaplibreMajor : 0;

export default defineConfig({
	plugins: [
		//svelteDocgenPlugin(),
		tailwindcss(),
		sveltekit()
	],

	server: {
		fs: {
			allow: [searchForWorkspaceRoot(process.cwd())]
		}
	},

	resolve: {
		alias: {
			path: 'pathe'
		}
	},

	optimizeDeps:
		maplibreMajor >= 6
			? {
					exclude: ['terra-draw-maplibre-gl-adapter']
				}
			: undefined,

	ssr:
		maplibreMajor < 6
			? {
					noExternal: ['maplibre-gl'],
					optimizeDeps: { include: ['maplibre-gl'] }
				}
			: undefined,

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
