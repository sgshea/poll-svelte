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
	</Card.Header>

	<Card.Content class="grid gap-4">
		<form method="POST" action="/poll/{question.id}" use:enhance>
			<Form.Fieldset {form} name="choice" class="flex items-center space-x-4 rounded-md border p-4">
				<RadioGroup.Root
					bind:value={$formData.choice}
					class="flex flex-col space-y-2"
					name="choice"
				>
					{#each question.choices as choice}
						<Form.Control>
							{#snippet children({ props })}
								<RadioGroup.Item value={choice.choice} {...props} />
								<Form.Label class="font-normal">{choice.choice}</Form.Label>
							{/snippet}
						</Form.Control>
					{/each}
				</RadioGroup.Root>
			</Form.Fieldset>
			<Form.Button>Vote</Form.Button>
		</form>
	</Card.Content>
</Card.Root>
