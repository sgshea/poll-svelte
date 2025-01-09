<!--
	Component: register-form
	This component is a form that allows users to register an account.
	Mostly the same as login-form, but with different text and links.
-->
<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Form from '$lib/components/ui/form/index.js';

	import { userSchema, type UserSchema } from '$lib/form-schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	let { validatedForm }: { validatedForm: SuperValidated<Infer<UserSchema>> } = $props();

	const form = superForm(validatedForm, {
		validators: zodClient(userSchema)
	});

	const { form: formData, enhance } = form;
</script>

<Card.Root class="mx-auto max-w-sm mt-12">
	<Card.Header>
		<Card.Title class="text-2xl">Register</Card.Title>
		<Card.Description>Enter a username and password below to register an account</Card.Description>
	</Card.Header>
	<Card.Content>
		<form method="post" action="?/register" use:enhance>
			<div class="grid gap-4">
				<div class="grid gap-2">
					<Form.Field {form} name="username">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Username</Form.Label>
								<Input {...props} bind:value={$formData.username} placeholder="jsmith" />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>
				<div class="grid gap-2">
					<Form.Field {form} name="password">
						<Form.Control>
							{#snippet children({ props })}
								<div class="flex items-center">
									<Form.Label for="password">Password</Form.Label>
								</div>
								<Input {...props} bind:value={$formData.password} type="password" placeholder="••••••" />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>
				<Form.Button>Register</Form.Button>
			</div>
			<div class="mt-4 text-center text-sm">
				Already have an account?
				<a href="/user/login" class="underline"> Login </a>
			</div>
		</form>
	</Card.Content>
</Card.Root>
