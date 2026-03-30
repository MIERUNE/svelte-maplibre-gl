---
'svelte-maplibre-gl': minor
---

Add `dataDiff` prop to `GeoJSONSource` for incremental updates via MapLibre's `updateData()` API. Property-only changes skip the full geojson-vt re-tile, significantly improving performance for large datasets.
