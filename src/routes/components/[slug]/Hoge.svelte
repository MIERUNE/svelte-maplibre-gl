<script lang="ts">
	let {
		foo = 'I will replace undefined'
	}: {
		foo: string | undefined;
	} = $props();

	$inspect(foo);
</script>
