<!--
	Component: poll-vote
	This component displays a single poll question along with it's choices and allows the user to vote on the poll.
	The form submits a post action to `/poll/{question.id}`.
-->
<script lang="ts">
	import { pollVoteSchema, type PollVoteSchema } from '$lib/form-schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import type { Question } from '$lib/types';

	// props:
	// question: Question to display, along with choices and votes
	// form: SuperValidated<PollVoteSchema> - form schema to validate
	const { question, formSchema } = $props<{
		question: Question;
		formSchema: SuperValidated<Infer<PollVoteSchema>>;
	}>();

	const form = superForm(formSchema, {
		validators: zodClient(pollVoteSchema)
	});

	const { form: formData, enhance } = form;

	import * as Card from '$lib/components/ui/card/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>{question.question}</Card.Title>
		<Card.Description>Choose an option to vote on the poll</Card.Description>
	</Card.Header>

	<form method="POST" action="/poll/{question.id}" use:enhance>
		<Card.Content class="grid gap-6">
			<Form.Fieldset {form} name="choice" class="flex items-center space-x-4 rounded-md border p-4">
				<RadioGroup.Root bind:value={$formData.choice} class="grid grid-cols-3 gap-4" name="choice">
					{#each question.choices as choice}
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label
									class="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
								>
									<RadioGroup.Item value={choice.choice} class="sr-only" {...props} />
									{choice.choice}
								</Form.Label>
							{/snippet}
						</Form.Control>
					{/each}
				</RadioGroup.Root>
			</Form.Fieldset>
		</Card.Content>
		<Card.Footer>
			<Form.Button>Vote</Form.Button>
		</Card.Footer>
	</form>
</Card.Root>
