<script lang="ts">
	import type { PageData } from './$types.js';
    import PollForm from './poll-creation-form.svelte';
	let { data }: { data: PageData } = $props();
</script>

<div class="flex h-screen w-full items-start justify-center px-4">
	<PollForm data={data.form} />
</div>