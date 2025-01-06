<script lang="ts">
	import type { PageData } from './$types';
	import PollVote from '$lib/components/poll-vote.svelte';
	import Poll from '$lib/components/poll.svelte';
	let { data }: { data: PageData } = $props();
</script>

<div class="flex justify-center my-4">
	<div class="bg-gray-100 rounded-lg px-6 py-3">
		<h1 class="text-2xl font-bold">Completed Polls</h1>
	</div>
</div>

<div class="container mx-auto my-8">
	<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
		{#each data.questions as question}
			<!-- <PollVote {question} formSchema={data.form} /> -->
			<Poll {question} />
		{/each}
	</div>
</div>
