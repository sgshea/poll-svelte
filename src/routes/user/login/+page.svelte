<script lang="ts">
	import type { PageData } from './$types';

	import LoginForm from "$lib/components/login-form.svelte";

	let { data }: { data: PageData } = $props();
</script>

<div class="flex h-screen w-full items-start justify-center px-4">
	<LoginForm validatedForm={data.form}/>
</div>
