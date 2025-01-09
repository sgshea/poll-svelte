<script lang="ts">
	import type { PageData } from './$types.js';
    import PollForm from './poll-creation-form.svelte';
	let { data }: { data: PageData } = $props();
</script>

<PollForm data={data.form} />
