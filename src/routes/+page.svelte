<script lang="ts">
	import type { PageData } from './$types';
    import Poll from '$lib/components/poll.svelte';
	let { data }: { data: PageData } = $props();
</script>

<h1>Welcome to SvelteKit</h1>

<ul>
	{#each data.questions as question}
        <Poll {question} />
	{/each}
</ul>
