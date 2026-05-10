---
'svelte-maplibre-gl': patch
---

fix(Sprite): capture `id`/`url` at effect-run time so cleanup removes the sprite that was actually added, preventing the previous sprite from leaking when these props change.

fix(Image): when `id` changes (without dimension changes), `addImage` is now called for the new id instead of `updateImage`, which previously fired an upstream error for the missing id.
