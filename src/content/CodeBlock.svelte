<script lang="ts" module>
	import {
		createHighlighterCoreSync,
		createOnigurumaEngine,
		createJavaScriptRegexEngine,
		type HighlighterCore
	} from 'shiki';
	import svelte from 'shiki/langs/svelte.mjs';
	import dark from 'shiki/themes/github-dark-default.mjs';
	import { browser } from '$app/environment';

	const shiki2 = createHighlighterCoreSync({
		themes: [dark],
		langs: [svelte],
		// Use the WASM version of Oniguruma on the browser, and the JS engine on the server
		engine: browser ? await createOnigurumaEngine(import('shiki/wasm')) : createJavaScriptRegexEngine()
	});
</script>

<script lang="ts">
	let {
		content
	}: {
		content: string;
	} = $props();

	const highlighted = $derived.by(() => {
		return shiki2.codeToHtml(content.replaceAll('\t', '  ').trim(), { lang: 'svelte', theme: 'github-dark-default' });
	});
</script>

<div class="my-6 subpixel-antialiased">
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html highlighted}
</div>

<style>
	:global(.shiki code) {
		font-size: 13px;
		tab-size: 2;
		counter-reset: step;
		counter-increment: step 0;
	}

	:global(.shiki code .line::before) {
		content: counter(step);
		counter-increment: step;
		width: 1rem;
		margin-right: 1.5rem;
		display: inline-block;
		text-align: right;
		color: rgba(115, 138, 148, 0.5);
	}
</style>
