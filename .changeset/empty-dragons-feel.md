---
'svelte-maplibre-gl': patch
---

Use `$effect.pre` for source tile updates so they run before the map’s option/camera effects when both change in the same tick.
