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

Now you can add the simplest MapLibre GL JS map to your `+page.svelte` file with just one line of code.

<CodeBlock content={simplestRaw} {shiki} />
<Simplest />

## 4. Put a Marker on the Map

Let’s set an initial zoomand put a marker pin on the map.

<CodeBlock content={markerRaw} {shiki} />
<Marker />
