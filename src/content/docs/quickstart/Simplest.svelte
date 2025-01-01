<script lang="ts">
	import { MapLibre } from 'svelte-maplibre-gl';
</script>

<!-- Height must be set, otherwise the map size will be zero! -->
<!-- Our examples use Tailwind CSS classes for styling. -->
<MapLibre class="h-[400px]" style="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json" />
