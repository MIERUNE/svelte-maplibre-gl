---
title: Video on a map
description: Display a video.
---

<script lang="ts">
  import Demo from "./Video.svelte";
  import demoRaw from "./Video.svelte?raw";
  import CodeBlock from "../../CodeBlock.svelte";
    let { shiki } = $props();
</script>

<Demo />

<CodeBlock content={demoRaw} {shiki} />
