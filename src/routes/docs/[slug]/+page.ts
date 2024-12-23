import { error } from '@sveltejs/kit';
import type { Component } from 'svelte';
import { browser } from '$app/environment';

import { createHighlighter, createJavaScriptRegexEngine, createOnigurumaEngine } from 'shiki';
import svelte from 'shiki/langs/svelte.mjs';
import dark from 'shiki/themes/github-dark-default.mjs';

const shiki = createHighlighter({
	themes: [dark],
	langs: [svelte],
	engine: browser ? createOnigurumaEngine(import('shiki/wasm')) : createJavaScriptRegexEngine()
});

export const load = async ({ params }) => {
	const { slug } = params;

	try {
		const post = (await import(`$content/docs/${slug}/content.svelte.md`)) as {
			default: Component;
			metadata: {
				title: string;
				description: string;
			};
		};
		return {
			Content: post.default,
			meta: { ...post.metadata, slug },
			shiki: await shiki
		};
	} catch {
		error(404, `Docs '${slug}' not found`);
	}
};
