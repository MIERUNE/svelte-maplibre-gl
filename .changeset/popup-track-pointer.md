---
'svelte-maplibre-gl': minor
---

feat(Popup): add `trackPointer` prop. When `true`, the popup follows the cursor instead of being pinned to `lnglat`, mirroring `Popup.trackPointer()` upstream. Toggling the prop reactively switches between cursor-tracking and anchored modes.
