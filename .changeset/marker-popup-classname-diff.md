---
'svelte-maplibre-gl': patch
---

perf(Marker, Popup): apply only the className delta on `class` prop changes instead of removing every previous class and re-adding every new class. Avoids redundant DOM mutations when the class list is partially updated (e.g. toggling a single class in a multi-class string).
