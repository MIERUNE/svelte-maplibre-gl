import { error } from '@sveltejs/kit';
import { parse } from 'svelte-docgen';

type ParsedComponent = ReturnType<typeof parse>;

const loader: Record<string, () => Promise<{ default: ParsedComponent }>> = Object.fromEntries(
	Object.entries(import.meta.glob('$lib/maplibre/**/*.svelte', { query: '?docgen' })).map(([key, value]) => {
		const name = key.match(/\/([^/]+)\.svelte$/)?.[1];
		return [name, value] as const;
	})
);

export const load = async ({ params }) => {
	const { slug } = params;

	const doc = (await loader[slug]()).default;
	if (!doc) {
		error(404, `Component '${slug}' not found`);
	}
	return {
		title: slug,
		targetComponent: slug,
		doc
	};
};
