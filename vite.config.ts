import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { searchForWorkspaceRoot } from 'vite';
// import svelteDocgenPlugin from 'vite-plugin-svelte-docgen';
import { defineConfig } from 'vitest/config';

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

	ssr: {
		// Workaround for maplibre-gl v5: its dist is UMD declared as "type": "module",
		// so Node's native ESM loader exposes only `default`/`module.exports` and the
		// namespace import ends up empty. Bundling through Vite applies CJS interop
		// so values like `maplibregl.LngLat` resolve at SSR time. Remove once
		// maplibre-gl ships proper ESM exports.
		noExternal: ['maplibre-gl']
	},

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
