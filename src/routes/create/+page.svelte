<!--
Page which contains poll creation form.
Page is protected by server, only logged in users can created polls.
-->
<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { pollQuestionSchema } from '$lib/form-schema';

	import * as Form from '$lib/components/ui/form/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { toast } from 'svelte-sonner';
	import { Toaster } from '$lib/components/ui/sonner';

	let { data }: { data: PageData } = $props();

	const form = superForm(data.form, {
		validators: zodClient(pollQuestionSchema),
		// onUpdated hook which creates a toast to notify the user that the poll was successfully created
		// provides a link to the new poll
		onUpdated({ form }) {
			if (form.message) {
				console.log(form);
				toast(form.message.text, {
					action: {
						label: 'Goto',
						onClick: () => (window.location.href = `/poll/${form.message.id}`)
					}
				});
			}
		}
	});

	const { form: formData, enhance } = form;

	// Make sure options is not less than 2
	$effect(() => {
		if ($formData.options.length < 2) {
			$formData.options = ['', ''];
		}
	});

	function addOption() {
		$formData.options = [...$formData.options, ''];
	}

	function removeOption(index: number) {
		$formData.options = $formData.options.filter((_, i) => i !== index);
	}
</script>

<Toaster closeButton/>

<div class="flex h-screen w-full items-start justify-center px-4">
	<Card.Root class="mx-auto mt-5 max-w-lg">
		<Card.Header>
			<Card.Title class="text-2xl">Create a new Poll</Card.Title>
			<Card.Description>Enter a question and 2-10 possible options for the poll</Card.Description>
		</Card.Header>
		<Card.Content>
			<form method="post" use:enhance>
				<div class="grid gap-4">
					<div class="grid gap-2">
						<Form.Field {form} name="question">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Question</Form.Label>
									<Input
										{...props}
										bind:value={$formData.question}
										placeholder="Ask a question..."
									/>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</div>
					<div class="grid gap-2">
						<Form.Fieldset {form} name="options">
							{#each $formData.options as _, i}
								<Form.ElementField {form} name="options[{i}]">
									<Form.Control>
										{#snippet children({ props })}
											<div class="mt-2 flex gap-2">
												<Input
													{...props}
													bind:value={$formData.options[i]}
													placeholder="Enter option"
												/>
												{#if $formData.options.length > 2}
													<Button variant="destructive" onclick={() => removeOption(i)}
														>Remove</Button
													>
												{/if}
											</div>
										{/snippet}
									</Form.Control>
								</Form.ElementField>
							{/each}
							<Form.FieldErrors />
						</Form.Fieldset>
					</div>
					<div class="flex justify-between">
						<Form.Button class="mr-2 w-full">Submit Poll</Form.Button>
						{#if $formData.options.length < 10}
							<Button variant="secondary" onclick={addOption}>Add Option</Button>
						{/if}
					</div>
				</div>
			</form>
		</Card.Content>
	</Card.Root>
</div>
