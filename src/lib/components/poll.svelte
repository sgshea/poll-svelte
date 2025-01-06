<!--
	Component: poll
	This component displays a single poll question along with it's choices and current votes.
	It does *not* support voting on the poll. Use poll-vote for that.
-->
<script lang="ts">
	import type { Choice, Question } from '$lib/types';

	// props:
	// question: Question to display, along with choices and votes
	const { question } = $props<{
		question: Question;
	}>();

	import * as Card from '$lib/components/ui/card/index.js';

	import { BarChart, Tooltip } from 'layerchart';

	// Transform choice data into data to be passed into the chart(s)
	const chartData = question.choices.map((choice: Choice) => ({
		choice: choice.choice,
		votes: choice.votes.length
	}));
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>{question.question}</Card.Title>
	</Card.Header>

	<Card.Content class="mx-4 my-4 h-[300px] rounded border p-4">
		<BarChart
			data={chartData}
			x="choice"
			y="votes"
			props={{
				yAxis: {
					format: 'integer'
				}
			}}
			labels={{
				format: 'integer'
			}}
		>
			<svelte:fragment slot="tooltip" let:x let:y>
				<Tooltip.Root let:data>
					<Tooltip.Header>{x(data)}</Tooltip.Header>
					<Tooltip.List>
						<Tooltip.Item label="votes" value={y(data)} />
					</Tooltip.List>
				</Tooltip.Root>
			</svelte:fragment>
		</BarChart>
	</Card.Content>

	<Card.Footer>
		<p class="text-sm text-muted-foreground">
			Question {question.id} created at {question.createdAt}
		</p>
	</Card.Footer>
</Card.Root>
