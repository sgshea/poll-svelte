<script lang="ts">
	import Poll from '$lib/components/poll.svelte';
	import { type PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

<div class="my-4 flex h-screen items-start justify-center px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
	<Poll question={data.question!} userChoice={data.userChoice} />
</div>
