<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

<h1>Welcome to SvelteKit</h1>

<ul>
	{#each data.questions as question}
		<li>
			<div>
				{question.id}
				{question.question}
				{question.createdAt}
			</div>
		</li>
	{/each}
</ul>
