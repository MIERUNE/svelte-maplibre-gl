# svelte-maplibre-gl

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
