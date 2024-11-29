<script lang="ts">
	import { MapLibre, FullScreenControl } from 'svelte-maplibre-gl';
</script>

<MapLibre
	class="h-[55vh] min-h-[300px] border-8 border-slate-500"
	style="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
>
	<FullScreenControl position="top-left" />
</MapLibre>
