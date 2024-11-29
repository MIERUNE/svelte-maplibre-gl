---
title: Fullscreen
description: View a fullscreen map
---

<script lang="ts">
  import Demo from "./Fullscreen.svelte";
  import demoRaw from "./Fullscreen.svelte?raw";
  import CodeBlock from "../../CodeBlock.svelte";
  let { shiki } = $props();
</script>

<Demo />

<CodeBlock content={demoRaw} {shiki} />
