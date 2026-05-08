---
title: Marker and Popup
description: Control marker click, drag, and popup states using Svelte’s reactivity.
---

<script lang="ts">
  import Demo from "./MarkerAndPopup.svelte";
  import demoRaw from "./MarkerAndPopup.svelte?raw";
  import CodeBlock from "../../CodeBlock.svelte";
  let { shiki } = $props();
</script>

<Demo />

<CodeBlock content={demoRaw} {shiki} />
