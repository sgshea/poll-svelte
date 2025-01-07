<script lang="ts">
	import PollVote from '$lib/components/poll-vote.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="my-4 flex justify-center">
	{#if data.question}
		<PollVote question={data.question} formSchema={data.formSchema} />
	{/if}
</div>
