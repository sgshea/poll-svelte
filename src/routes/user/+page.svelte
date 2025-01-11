<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';

	import * as Card from '$lib/components/ui/card/index.js';
	import Poll from '$lib/components/poll.svelte';

	let { data }: { data: PageServerData } = $props();
	const { user, createdQuestions } = data;
</script>

<div class="mx-auto my-4 grid max-w-7xl grid-cols-2 auto-rows-max gap-4">
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
					{#each createdQuestions as question}
						<Poll {question} />
					{/each}
				</div>
			</div>
		</Card.Content>
	</Card.Root>

	<Card.Root class="col-start-2 row-start-2">
		<Card.Title class="mt-4 text-center text-xl">Votes</Card.Title>
		<Card.Description></Card.Description>
		<Card.Content></Card.Content>
		<Card.Footer></Card.Footer>
	</Card.Root>
</div>
