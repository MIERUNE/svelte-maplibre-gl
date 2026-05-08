import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { createRequire } from 'node:module';
import { searchForWorkspaceRoot } from 'vite';
// import svelteDocgenPlugin from 'vite-plugin-svelte-docgen';
import { defineConfig } from 'vitest/config';

const require = createRequire(import.meta.url);
const maplibreVersion = require('maplibre-gl/package.json').version as string;
const maplibreMajor = Number.parseInt(maplibreVersion, 10);

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
					// Workaround for maplibre-gl v5: its dist is UMD declared as "type": "module",
					// so Node's native ESM loader exposes only `default`/`module.exports` and the
					// namespace import ends up empty. Bundling through Vite applies CJS interop
					// so values like `maplibregl.LngLat` resolve at SSR time. v6+ ships proper
					// ESM, so this workaround is skipped and the package is treated as external.
					noExternal: ['maplibre-gl']
				}
			: undefined,

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
