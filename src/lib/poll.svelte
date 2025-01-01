<script lang="ts">
	import type { Question } from '$lib/types';

	export let question: Question;
</script>

<li class="flex flex-col gap-2 rounded border p-1">
	<div>
		<h3>
			{question.question}
		</h3>
	</div>
</li>
