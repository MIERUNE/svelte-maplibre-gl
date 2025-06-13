<script lang="ts">
	// https://maplibre.org/maplibre-style-spec/sprite/

	import { getMapContext } from '../contexts.svelte.js';

	interface Props {
		id: string;
		url: string;
	}
	let { id, url }: Props = $props();

	const mapCtx = getMapContext();

	$effect(() => {
		if (!mapCtx.map) {
			return;
		}
		mapCtx.waitForStyleLoaded((map) => {
			map.addSprite(id, url);
		});

		return () => {
			mapCtx.waitForStyleLoaded((map) => {
				map.removeSprite(id);
			});
		};
	});
</script>
