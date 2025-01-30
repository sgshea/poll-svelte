<!--
This page displays the results of a singular poll.
-->
<script lang="ts">
	import Poll from '$lib/components/poll.svelte';
	import type { Vote } from '$lib/types';
	import { supabase } from '../../../supabaseClient';
	import { type PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();

	// Save data into state rune
	let question = $state(data.question!);

	// Effect rune which opens a channel to the votes table, listening for new votes.
	// This will update the question state with new votes, and trigger changes in the child Poll component
	$effect(() => {
		const channel = supabase
			.channel('supabase_realtime')
			.on('postgres_changes', { event: '*', schema: 'public', table: 'votes' }, (payload) => {
				if (payload.eventType === 'INSERT') {
					const choiceId = payload.new.choice_id;

					// Finds the correct choice and inserts as a new vote
					for (const choice of question.choices) {
						if (choice.id === choiceId) {
							const vote = { id: payload.new.id, choiceId } as Vote;
							choice.votes.push(vote);
							break;
						}
					}
				}
			})
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	});
</script>

<div class="my-4 flex h-screen items-start justify-center px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
	<Poll question={question} userChoice={data.userChoice} />
</div>
