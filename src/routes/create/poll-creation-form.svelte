<!--
	Component: poll-creation-form
	This component supports creating a new poll with a question and 2-10 options.
	It submits to the `/create` endpoint.
-->
<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { pollQuestionSchema, type PollQuestionSchema } from '$lib/form-schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let data: SuperValidated<Infer<PollQuestionSchema>>;

	const form = superForm(data, {
		validators: zodClient(pollQuestionSchema)
	});

	const { form: formData, enhance } = form;

	// Add two initial options
	if ($formData.options.length === 0) {
		$formData.options = ['', ''];
	}

	function addOption() {
		$formData.options = [...$formData.options, ''];
	}

	function removeOption(index: number) {
		$formData.options = $formData.options.filter((_, i) => i !== index);
	}
</script>

<div class="container mx-auto p-4">
	<form method="POST" use:enhance>
		<Form.Field {form} name="question">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Question</Form.Label>
					<Input {...props} bind:value={$formData.question} placeholder="Ask a question..." />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<div class="space-y-4">
			{#if $formData.options.length > 2 && $formData.options.length < 10}
				<p>Add between 2 and 10 options for your poll</p>
			{:else}
				<p>Must have between 2 and 10 options</p>
			{/if}
			{#if $formData.options.length < 10}
				<Button variant="secondary" onclick={addOption}>Add Option</Button>
			{/if}
		</div>

		<div class="space-y-4">
			<Form.Fieldset {form} name="options">
				{#each $formData.options as _, i}
					<Form.ElementField {form} name="options[{i}]">
						<Form.Control>
							{#snippet children({ props })}
								<div class="mt-2 flex gap-2">
									<Input {...props} bind:value={$formData.options[i]} placeholder="Enter option" />
									{#if $formData.options.length > 2}
										<Button variant="destructive" onclick={() => removeOption(i)}>Remove</Button>
									{/if}
								</div>
							{/snippet}
						</Form.Control>
					</Form.ElementField>
				{/each}
				<Form.FieldErrors />
			</Form.Fieldset>
		</div>
		<Form.Button>Submit</Form.Button>
	</form>
</div>
