<script lang="ts">
	import type { PageData } from './$types';
	import Poll from '$lib/components/poll.svelte';
	import { supabase } from '../supabaseClient';
	import type { Question, Vote } from '$lib/types';
	let { data }: { data: PageData } = $props();

	// Save data into state rune which will be used in Poll components
	let questions = $state(data.questions);

	// Effect rune which opens a channel to the votes table, listening for new votes.
	// This will update the question state with new votes, and trigger changes in the child Poll component
	$effect(() => {
		const votesChannel = supabase
			.channel('supabase_realtime')
			.on('postgres_changes', { event: '*', schema: 'public', table: 'votes' }, (payload) => {
				if (payload.eventType === 'INSERT') {
					const choiceId = payload.new.choice_id;

					// Finds the correct choice and inserts as a new vote
					for (const question of questions) {
						for (const choice of question.question.choices) {
							if (choice.id === choiceId) {
								const vote = { id: payload.new.id, choiceId } as Vote;
								choice.votes.push(vote);
								break;
							}
						}
					}
				}
			})
			.subscribe();

		return () => {
			supabase.removeChannel(votesChannel);
		};
	});

	// Effect rune which opens a channel to the questions table, listening for new questions to be displayed.
	$effect(() => {
		const questionsChannel = supabase
			.channel('supabase_realtime')
			.on('postgres_changes', { event: '*', schema: 'public', table: 'questions' }, async (payload) => {
				if (payload.eventType === 'INSERT') {
					const newQuestion = payload.new;
					// Get the question from our API
					const response = await fetch(`/poll/${newQuestion.id}`);
					const item = await response.json();
					// Insert into questions array
					questions.push({question: item as Question, userChoice: undefined});
				}
			})
			.subscribe();

		return () => {
			supabase.removeChannel(questionsChannel);
		};
	});
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
