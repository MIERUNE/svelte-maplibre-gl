---
'svelte-maplibre-gl': patch
---

- Support MapLibre GL JS 6.19 camera bindings.
- Support image sources that start without a URL.
- Pass initial global state to the map constructor on supported versions.
- Update the custom protocol example for the current response type.

- Reconcile constructor-provided global state when keys change before an asynchronous style finishes loading.
- Pin Playwright CI jobs to supported Ubuntu 24.04 images and isolate their browser caches by OS version and architecture.
- Keep camera E2E coverage on MapLibre v5 while limiting URL-less image-source tests to MapLibre 6.7 and later.
