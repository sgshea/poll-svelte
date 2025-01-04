<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
	import { pollVoteSchema, type PollVoteSchema } from '$lib/form-schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import type { Question } from '$lib/types';

    const { question, data } = $props<{
        question: Question;
        data: SuperValidated<Infer<PollVoteSchema>>;
    }>();

	const form = superForm(data, {
		validators: zodClient(pollVoteSchema)
	});

	const { form: formData, enhance } = form;

	// console.log(question);
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>{question.question}</Card.Title>
	</Card.Header>

	<Card.Content class="grid gap-4">
		<form method="POST" use:enhance>
			<Form.Fieldset {form} name="choice" class="flex items-center space-x-4 rounded-md border p-4">
				<RadioGroup.Root
                    bind:value={$formData.choice}
                    class="flex flex-col space-y-2"
                    name="choice">
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
