<script lang="ts">
	import maplibregl from 'maplibre-gl';

	const { scheme, loadFn }: { scheme: string; loadFn: maplibregl.AddProtocolAction } = $props();

	$effect(() => {
		maplibregl.addProtocol(scheme, loadFn);
		const prevName = scheme;
		return () => {
			maplibregl.removeProtocol(prevName);
		};
	});
</script>
