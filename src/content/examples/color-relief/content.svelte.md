---
title: Color Relief
description: Render hypsometric tints using DEM sources
original: https://nathanmolson.github.io/color_relief/
---

<script lang="ts">
  import Demo from "./ColorRelief.svelte";
  import demoRaw from "./ColorRelief.svelte?raw";
  import CodeBlock from "../../CodeBlock.svelte";
  let { shiki } = $props();
</script>

<Demo />

<CodeBlock content={demoRaw} {shiki} />
