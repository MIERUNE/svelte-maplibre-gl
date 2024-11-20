<script lang="ts">
	import { createHighlighterCoreSync, createJavaScriptRegexEngine } from 'shiki';
	import svelte from 'shiki/langs/svelte.mjs';
	import dark from 'shiki/themes/github-dark-default.mjs';

	let {
		content
	}: {
		content: string;
	} = $props();

	const shiki = createHighlighterCoreSync({
		themes: [dark],
		langs: [svelte],
		engine: createJavaScriptRegexEngine()
	});

	const highlighted = $derived.by(() => {
		return shiki.codeToHtml(content.trim(), { lang: 'svelte', theme: 'github-dark-default' });
	});
</script>

<div class="my-6 subpixel-antialiased">
	{@html highlighted}
</div>

<style>
	:global(.shiki code) {
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
		color: rgba(115, 138, 148, 0.4);
	}
</style>
