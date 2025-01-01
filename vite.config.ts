import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

import svelteDocgenPlugin from 'vite-plugin-svelte-docgen';

export default defineConfig({
	plugins: [svelteDocgenPlugin(), sveltekit()],

	resolve: {
		alias: {
			path: 'pathe'
		}
	},

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
