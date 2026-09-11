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

## 3. Configure Vite

Add `maplibre-gl` to `optimizeDeps.exclude` in your `vite.config.ts`.

```ts
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	optimizeDeps: {
		exclude: ['maplibre-gl']
	}
});
```

Without this, Vite's dependency optimizer pre-bundles MapLibre GL JS separately from the
worker setup entry, so the web worker is requested from a path that does not exist and fails
to load. This only affects the dev server, not production builds.

## 4. Add the Simplest Map

Import the Vite adapter once to configure the MapLibre GL JS v6 worker, then add the simplest
map to your `+page.svelte` file.

<CodeBlock content={simplestRaw} {shiki} />
<Simplest />

## 5. Put a Marker on the Map

Let’s set an initial zoom and put a marker pin on the map.

<CodeBlock content={markerRaw} {shiki} />
<Marker />
