---
title: Quickstart
description: Get started with svelte-maplibre-gl in just a few minutes.
---

<script lang="ts">
  import Simplest from "./Simplest.svelte";
  import simplestRaw from "./Simplest.svelte?raw";
  import Marker from "./Marker.svelte";
  import markerRaw from "./Marker.svelte?raw";
  import CodeBlock from "../../CodeBlock.svelte";
  let { shiki } = $props();
</script>

## 1. Launch a SvelteKit Project

Create a new SvelteKit project using the official [Svelte CLI](https://svelte.dev/docs/kit/creating-a-project).

```bash
npx sv create myapp
# Make sure to enable the Tailwind CSS add-on,
# as our examples use it for styling.

cd myapp
npm install
```

## 2. Install `svelte-maplibre-gl`

```bash
npm install -D svelte-maplibre-gl
```

## 3. Add the Simplest Map

Import the Vite adapter once to configure the MapLibre GL JS v6 worker, then add the simplest
map to your `+page.svelte` file.

<CodeBlock content={simplestRaw} {shiki} />
<Simplest />

## 4. Put a Marker on the Map

Let’s set an initial zoom and put a marker pin on the map.

<CodeBlock content={markerRaw} {shiki} />
<Marker />
