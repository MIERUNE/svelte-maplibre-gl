---
title: Terra Draw
description: terra-draw
---

<script lang="ts">
  import Demo from "./TerraDraw.svelte";
  import demoRaw from "./TerraDraw.svelte?raw";
  import CodeBlock from "../../CodeBlock.svelte";
  let { shiki } = $props();
</script>

<Demo />

<CodeBlock content={demoRaw} {shiki} />
