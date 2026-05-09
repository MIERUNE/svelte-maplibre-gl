---
'svelte-maplibre-gl': patch
---

fix(MapLibre): make `padding` bindable and sync it from the transform on `move` so user-driven `easeTo({ padding })` calls are no longer cancelled by the reactive update. `padding={undefined}` now means "library does not control padding" (consistent with `center`/`zoom`); to clear the map's padding, pass an explicit zero-valued padding object instead.
