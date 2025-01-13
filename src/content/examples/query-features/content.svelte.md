---
title: Query Features
description: Query source and rendered features to place markers and display a list.
---

<script lang="ts">
  import Demo from "./Query.svelte";
  import demoRaw from "./Query.svelte?raw";
  import CodeBlock from "../../CodeBlock.svelte";
  let { shiki } = $props();
</script>

<Demo />

<CodeBlock content={demoRaw} {shiki} />
