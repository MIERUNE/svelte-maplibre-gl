---
'svelte-maplibre-gl': patch
---

fix(RawLayer): clearing `beforeId` (changing it from a layer id back to `undefined`) now moves the layer to the top via `map.moveLayer(id)`, instead of leaving it at its previous position.
