import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

import svelteDocgenPlugin from 'vite-plugin-svelte-docgen';

export default defineConfig({
	// @ts-expect-error: curretly broken
	plugins: [svelteDocgenPlugin(), sveltekit()],

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
