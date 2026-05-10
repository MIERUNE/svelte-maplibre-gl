# svelte-maplibre-gl

## 2.0.1

### Patch Changes

- b6b4a8c: fix(ImageLoader): pass `tasks` directly to `Promise.allSettled` instead of wrapping it in another array. Previously the wrapped form resolved immediately, flipping `loading` to `false` and rendering children before any image had actually loaded; rejected loads were also silently swallowed.

  fix(ImageLoader): when the same id is reassigned to a different url before its previous load resolves, the stale resolution no longer overwrites the newer image. The async task now compares the captured url against the current `loadedImages` entry before adding.

- b6b4a8c: perf(Marker, Popup): apply only the className delta on `class` prop changes instead of removing every previous class and re-adding every new class. Avoids redundant DOM mutations when the class list is partially updated (e.g. toggling a single class in a multi-class string).
- b6b4a8c: feat(Popup): add `trackPointer` prop. When `true`, the popup follows the cursor instead of being pinned to `lnglat`, mirroring `Popup.trackPointer()` upstream. Toggling the prop reactively switches between cursor-tracking and anchored modes.
- b6b4a8c: fix(RawLayer): clearing `beforeId` (changing it from a layer id back to `undefined`) now moves the layer to the top via `map.moveLayer(id)`, instead of leaving it at its previous position.
- b6b4a8c: fix(Sprite): capture `id`/`url` at effect-run time so cleanup removes the sprite that was actually added, preventing the previous sprite from leaking when these props change.

  fix(Image): when `id` changes (without dimension changes), `addImage` is now called for the new id instead of `updateImage`, which previously fired an upstream error for the missing id.

## 2.0.0

### Minor Changes

- 14842b3: feat: track maplibre-gl 5.10+/5.18+/5.19+ features

### Patch Changes

- 717a771: fix(MapLibre): make `padding` bindable and sync it from the transform on `move` so user-driven `easeTo({ padding })` calls are no longer cancelled by the reactive update. `padding={undefined}` now means "library does not control padding" (consistent with `center`/`zoom`); to clear the map's padding, pass an explicit zero-valued padding object instead.
- 2cf585c: Handle sources and layers within Svelte key blocks that specify a fixed source/layer id

## 1.0.3

### Patch Changes

- 6b3cd54: Handle feature.id being undefined in QueryRenderedFeatures.svelte

## 1.0.2

### Patch Changes

- 608c2b5: Fix: add missing source prop to CircleLayer

## 1.0.1

### Patch Changes

- a5cc3ef: Fix: GeolocationControl causes infinite $effect loop with latest Svelte
