---
'svelte-maplibre-gl': patch
---

fix(ImageLoader): pass `tasks` directly to `Promise.allSettled` instead of wrapping it in another array. Previously the wrapped form resolved immediately, flipping `loading` to `false` and rendering children before any image had actually loaded; rejected loads were also silently swallowed.

fix(ImageLoader): when the same id is reassigned to a different url before its previous load resolves, the stale resolution no longer overwrites the newer image. The async task now compares the captured url against the current `loadedImages` entry before adding.
