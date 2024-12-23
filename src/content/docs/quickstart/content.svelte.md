---
title: Quickstart
description: Get started with svelte-maplibre-gl in a few minutes.
---

<script lang="ts">
  import Maplibre from "./Maplibre.svelte";
  import maplibreRaw from "./Maplibre.svelte?raw";
  import CodeBlock from "../../CodeBlock.svelte";
  let { shiki } = $props();
</script>

## Launch SvelteKit project

```
npx sv create mymap
# TailwindCSS option must be enabled, svelte-maplibre-gl uses depends on it.

cd myapp
npm install
```

### Install svelte-maplibre-gl

```
npm install -D svelte-maplibre-gl
```

Then you can make a map of MapLibre GL JS only with one line of code.

<CodeBlock content={maplibreRaw} {shiki} />
<Maplibre />
