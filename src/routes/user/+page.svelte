<script lang="ts">
	import type { PageServerData } from './$types';

	import * as Card from '$lib/components/ui/card/index.js';
	import Poll from '$lib/components/poll.svelte';
	import { supabase } from '../../supabaseClient';
	import { Toaster } from '$lib/components/ui/sonner';
	import type { Question, Vote } from '$lib/types';
	import { toast } from 'svelte-sonner';

	let { data }: { data: PageServerData } = $props();
	const { user } = data;

	let createdQuestions = $state(data.createdQuestions);
	let votedQuestions = $state(data.votedQuestions);

	$effect(() => {
		const channel = supabase
			.channel('supabase_realtime')
			// Opens a channel to the votes table, listening for new votes.
			// This will update the question state with new votes, and trigger changes in the child Poll component
			.on('postgres_changes', { event: '*', schema: 'public', table: 'votes' }, (payload) => {
				if (payload.eventType === 'INSERT') {
					const choiceId = payload.new.choice_id;

					// Iterate over both questions arrays and update state if the vote corresponds to a vote in one of these
					// Make sure toast appears only once
					let hasToasted = false;
					for (const question of createdQuestions) {
						for (const choice of question.question.choices) {
							if (choice.id === choiceId) {
								const vote = { id: payload.new.id, choiceId } as Vote;
								choice.votes.push(vote);

								if (!hasToasted) {
									hasToasted = true;
									// Push a new toast
									toast(`New vote for "${question.question.question}"`, {
										description: `Choice "${choice.choice}" has received a new vote!`,
										action: {
											label: 'Goto',
											onClick: () => (window.location.href = `/poll/${question.question.id}`)
										}
									});
								}
								break;
							}
						}
					}
					for (const question of votedQuestions) {
						for (const choice of question.question.choices) {
							if (choice.id === choiceId) {
								const vote = { id: payload.new.id, choiceId } as Vote;
								choice.votes.push(vote);

								if (!hasToasted) {
									hasToasted = true;
									// Push a new toast
									toast(`New vote for "${question.question.question}"`, {
										description: `Choice "${choice.choice}" has received a new vote!`,
										action: {
											label: 'Goto',
											onClick: () => (window.location.href = `/poll/${question.question.id}`)
										}
									});
								}
								break;
							}
						}
					}
				}
			})
			// Opens a channel to the questions table, listening for new questions to be displayed.
			.on(
				'postgres_changes',
				{ event: '*', schema: 'public', table: 'questions' },
				async (payload) => {
					if (payload.eventType === 'INSERT') {
						const newQuestion = payload.new;
						// Make sure that this question is our user's question
						if (newQuestion.creator_id === user?.id) {
							// Get the question from our API
							const response = await fetch(`/poll/${newQuestion.id}`);
							const item = await response.json();
							// Insert into questions array
							createdQuestions.push({ question: item as Question, userChoice: undefined });

							// Push a new toast
							toast(`You created a new poll`, {
								description: `Question: ${newQuestion.question}`,
								action: {
									label: 'Goto',
									onClick: () => (window.location.href = `/poll/${newQuestion.id}`)
								}
							});
						}
					}
				}
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	});
</script>

<Toaster />

<div class="mx-auto my-4 grid max-w-7xl auto-rows-max grid-cols-2 gap-4">
	<Card.Root class="col-span-2">
		<Card.Title class="mt-4 text-center text-2xl">Hi, {user.username}</Card.Title>
		<Card.Content>
			<p class="text-center">
				Welcome to your user page! Here you can view your created polls, and polls you have voted
				on.
			</p>
		</Card.Content>
		<Card.Footer class="text-sm">Your user ID is {user.id}</Card.Footer>
	</Card.Root>

	<Card.Root class="col-start-1 row-start-2">
		<Card.Title class="mt-4 text-center text-xl">Created Polls</Card.Title>
		<Card.Description class="text-center text-sm"
			>You have created {createdQuestions.length}
			{#if createdQuestions.length == 1}
				poll
			{:else}
				polls
			{/if}</Card.Description
		>
		<Card.Content>
			<div class="container">
				<div class="grid grid-cols-1 gap-4">
					{#each createdQuestions as { question, userChoice }}
						<Poll {question} {userChoice} />
					{/each}
				</div>
			</div>
		</Card.Content>
	</Card.Root>

	<Card.Root class="col-start-2 row-start-2">
		<Card.Title class="mt-4 text-center text-xl">Votes</Card.Title>
		<Card.Description class="text-center text-sm">
			You have voted on {votedQuestions.length}
			{#if votedQuestions.length == 1}
				poll
			{:else}
				polls
			{/if}
		</Card.Description>
		<Card.Content>
			<div class="container">
				<div class="grid grid-cols-1 gap-4">
					{#each votedQuestions as { question, userChoice }}
						<Poll {question} {userChoice} />
					{/each}
				</div>
			</div>
		</Card.Content>
		<Card.Footer></Card.Footer>
	</Card.Root>
</div>
