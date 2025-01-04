<script lang="ts">
    import PollVote from '$lib/components/poll-vote.svelte';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
</script>

{#if data.question}
    <PollVote question={data.question} data={data.form} />
{/if}