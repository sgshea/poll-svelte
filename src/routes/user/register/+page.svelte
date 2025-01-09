<script lang="ts">
	import type { PageData } from './$types';

    import RegisterForm from '$lib/components/register-form.svelte';

	let { data }: { data: PageData } = $props();
</script>

<div class="flex h-screen w-full items-start justify-center px-4">
	<RegisterForm validatedForm={data.form}/>
</div>
