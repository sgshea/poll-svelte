<script lang="ts">
	import type { PageData } from './$types.js';
    import PollForm from './poll-creation-form.svelte';
	export let data: PageData;
</script>

<PollForm data={data.form} />
