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
	import { Button } from '$lib/components/ui/button/index.js';

	import { PieChart, Tooltip, BarChart } from 'layerchart';
	import { schemeTableau10 } from 'd3-scale-chromatic';


	// Transform choice data into data to be passed into the chart(s)
	const chartData = question.choices.map((choice: Choice) => ({
		choice: choice.choice,
		votes: choice.votes.length
	}));

	import { ChartPie, ChartColumn } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	// State to keep track of the current chart type
	let chartType = $state('bar');

	function toggleChartType() {
		chartType = chartType === 'bar' ? 'pie' : 'bar';
	}
</script>

{#snippet pollBarChart(data: any)}
	<BarChart
		{data}
		x="choice"
		y="votes"
		cRange={schemeTableau10}
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
{/snippet}

{#snippet pollPieChart(data: any)}
	<PieChart
		{data}
		key="choice"
		value="votes"
		padding={{ bottom: 40 }}
		legend={{ placement: 'bottom', orientation: 'horizontal' }}
		cRange={schemeTableau10}
	/>
{/snippet}

<Card.Root>
	<Card.Header>
		<Card.Title>{question.question}</Card.Title>

		<div class="ml-auto flex items-center">
			<Button class="mr-2" size="sm" href="/poll/{question.id}">Vote</Button>
			<Button variant="outline" size="icon" onclick={toggleChartType}>
				{#if chartType === 'bar'}
					<ChartPie />
				{:else}
					<ChartColumn />
				{/if}
			</Button>
		</div>
	</Card.Header>

	<Card.Content class="mx-4 my-4 rounded border p-4">
		{#if chartType === 'pie'}
			<div class="h-[300px]" in:fade>
				{@render pollPieChart(chartData)}
			</div>
		{:else}
			<div class="h-[300px]" in:fade>
				{@render pollBarChart(chartData)}
			</div>
		{/if}
	</Card.Content>

	<Card.Footer>
		<p class="text-sm text-muted-foreground">
			created at {question.createdAt} by {question.creator.username}
		</p>
	</Card.Footer>
</Card.Root>
