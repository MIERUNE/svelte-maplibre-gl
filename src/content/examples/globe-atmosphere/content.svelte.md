---
title: Globe with an atmosphere
description: Display a globe with an atmosphere.
original: https://maplibre.org/maplibre-gl-js/docs/examples/globe-atmosphere/
---

<script lang="ts">
  import Demo from "./Globe.svelte";
  import demoRaw from "./Globe.svelte?raw";
  import CodeBlock from "../../CodeBlock.svelte";
  let { shiki } = $props();
</script>

<Demo />

<CodeBlock content={demoRaw} {shiki} />
