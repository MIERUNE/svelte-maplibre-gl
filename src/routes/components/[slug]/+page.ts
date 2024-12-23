import { error } from '@sveltejs/kit';
import { parse, encode } from 'svelte-docgen';

type ParsedComponent = ReturnType<typeof parse>;

<<<<<<< Updated upstream
const loader: Record<string, () => Promise<ParsedComponent>> = Object.fromEntries(
	Object.entries(import.meta.glob('$lib/maplibre/**/*.svelte', { query: '?docs' })).map(([key, value]) => {
		const name = key.match(/\/([^/]+)\.svelte$/)?.[1];
		return [name, value] as const;
	})
);
||||||| Stash base
const shiki = createHighlighter({
	themes: [dark],
	langs: [svelte],
	engine: browser ? createOnigurumaEngine(import('shiki/wasm')) : createJavaScriptRegexEngine()
});
=======
<<<<<<< Updated upstream
const shiki = createHighlighter({
	themes: [dark],
	langs: [svelte],
	engine: browser ? createOnigurumaEngine(import('shiki/wasm')) : createJavaScriptRegexEngine()
});
||||||| Stash base
const loader: Record<string, () => Promise<ParsedComponent>> = Object.fromEntries(
	Object.entries(import.meta.glob('$lib/maplibre/**/*.svelte', { query: '?docs' })).map(([key, value]) => {
		const name = key.match(/\/([^/]+)\.svelte$/)?.[1];
		return [name, value] as const;
	})
);
=======
const loader: Record<string, () => Promise<{ default: ParsedComponent }>> = Object.fromEntries(
	Object.entries(import.meta.glob('$lib/maplibre/**/*.svelte', { query: '?docgen' })).map(([key, value]) => {
		const name = key.match(/\/([^/]+)\.svelte$/)?.[1];
		return [name, value] as const;
	})
);
>>>>>>> Stashed changes
>>>>>>> Stashed changes

export const load = async ({ params }) => {
	const { slug } = params;

<<<<<<< Updated upstream
	const doc = await loader[slug]();
	console.log(doc);
	if (!doc) {
		error(404, `Component '${slug}' not found`);
||||||| Stash base
	try {
		const post = (await import(`$content/components/${slug}/content.svelte.md`)) as {
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
		error(404, `Example '${slug}' not found`);
=======
<<<<<<< Updated upstream
	try {
		const post = (await import(`$content/components/${slug}/content.svelte.md`)) as {
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
		error(404, `Example '${slug}' not found`);
||||||| Stash base
	const doc = await loader[slug]();
	console.log(doc);
	if (!doc) {
		error(404, `Component '${slug}' not found`);
=======
	const doc: ParsedComponent = (await loader[slug]()).default;
	if (!doc) {
		error(404, `Component '${slug}' not found`);
>>>>>>> Stashed changes
>>>>>>> Stashed changes
	}
<<<<<<< Updated upstream

	return {
		title: slug,
		descripiton: `API Reference for ${slug}`,
		doc: encode(doc)
	};
||||||| Stash base
=======
<<<<<<< Updated upstream
||||||| Stash base

	return {
		title: slug,
		descripiton: `API Reference for ${slug}`,
		doc: encode(doc)
	};
=======

	return {
		title: slug,
		description: `API Reference for ${slug}`,
		encodedDoc: encode(doc)
	};
>>>>>>> Stashed changes
>>>>>>> Stashed changes
};
