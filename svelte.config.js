// mdsvex
import { mdsvex, escapeSvelte } from 'mdsvex';
import { createHighlighter } from 'shiki';

const theme = 'github-dark-default';
const highlighter = await createHighlighter({
	themes: [theme],
	langs: ['javascript', 'typescript', 'svelte', 'bash']
});

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	highlight: {
		highlighter: async (code, lang = 'text') => {
			const html = escapeSvelte(highlighter.codeToHtml(code, { lang, theme }));
			return `{@html \`${html}\` }`;
		}
	},
	extensions: ['.svelte.md', '.svx']
};

// SvelteKit
import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)],

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter(),
		alias: {
			$content: 'src/content',
			'svelte-maplibre-gl/contour': 'src/lib/maplibre/ext/contour/index.js',
			'svelte-maplibre-gl/deckgl': 'src/lib/maplibre/ext/deckgl/index.js',
			'svelte-maplibre-gl/pmtiles': 'src/lib/maplibre/ext/pmtiles/index.js',
			'svelte-maplibre-gl/terradraw': 'src/lib/maplibre/ext/terradraw/index.js',
			'svelte-maplibre-gl': 'src/lib/maplibre/index.js'
		}
	},

	extensions: ['.svelte', '.svx', '.svelte.md']
};

export default config;
