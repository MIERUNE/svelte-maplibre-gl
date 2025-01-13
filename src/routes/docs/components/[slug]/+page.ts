import { error } from '@sveltejs/kit';
import { parse } from 'svelte-docgen';

type ParsedComponent = ReturnType<typeof parse>;

const loaders: Record<string, () => Promise<{ default: ParsedComponent }>> = Object.fromEntries(
	Object.entries(import.meta.glob('$lib/maplibre/**/*.svelte', { query: '?docgen' })).map(([key, value]) => {
		const name = key.match(/\/([^/]+)\.svelte$/)?.[1];
		return [name, value] as const;
	})
);

export const load = async ({ params }) => {
	const { slug } = params;
	const loader = loaders[slug]();
	if (!loader) {
		error(404, `Component '${slug}' not found`);
	}
	const doc = (await loader).default;
	return {
		title: slug,
		targetComponent: slug,
		doc
	};
};
