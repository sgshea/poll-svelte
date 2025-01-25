<script lang="ts">
	import type { PageData } from './$types';
	import Poll from '$lib/components/poll.svelte';
	import { supabase } from '../supabaseClient';
	import type { Choice, Question } from '$lib/types';
	let { data }: { data: PageData } = $props();

	let questions = $state(data.questions);
</script>

<div class="my-4 flex justify-center">
	<div class="px-6 py-3">
		<h1 class="text-2xl font-bold">Current Polls</h1>
	</div>
</div>

<div class="container mx-auto my-8">
	<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
		{#each questions as { question, userChoice }}
			<Poll {question} {userChoice} />
		{/each}
	</div>
</div>
