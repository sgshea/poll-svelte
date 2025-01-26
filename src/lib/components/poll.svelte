<!--
	Component: poll
	This component displays a single poll question along with it's choices and current votes.
	It does *not* support voting on the poll. Use poll-vote for that.
-->
<script lang="ts">
	import type { Choice, Question, Vote } from '$lib/types';

	// props:
	// question: Question to display, along with choices and votes
	const { question, userChoice } = $props<{
		question: Question;
		userChoice: Choice | undefined;
	}>();

	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';

	import { PieChart, Tooltip, BarChart } from 'layerchart';
	import { schemeTableau10 } from 'd3-scale-chromatic';

	// Transform choice data into data to be passed into the chart(s)
	let chartData = $derived(
		question.choices.map((choice: Choice) => ({
			id: choice.id,
			choice: choice.choice,
			votes: choice.votes.length
		}))
	);

	import { ChartPie, ChartColumn } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
	import { supabase } from '../../supabaseClient';

	// State to keep track of the current chart type
	let chartType = $state('bar');

	function toggleChartType() {
		chartType = chartType === 'bar' ? 'pie' : 'bar';
	}
</script>

<Card.Root class="w-full">
	<Card.Header>
		<Card.Title>{question.question}</Card.Title>
		<Card.Description
			>{#if userChoice}You voted for {userChoice.choice}{/if}</Card.Description
		>

		<div class="ml-auto flex items-center">
			{#if userChoice}
				<Button class="mr-2" size="sm" href="/poll/{question.id}">Results</Button>
			{:else}
				<Button class="mr-2" size="sm" href="/poll/{question.id}/vote">Vote</Button>
			{/if}
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
				<PieChart
					data={chartData}
					key="choice"
					value="votes"
					padding={{ bottom: 40 }}
					legend={{ placement: 'bottom', orientation: 'horizontal' }}
					c="choice"
					cRange={schemeTableau10}
				/>
			</div>
		{:else}
			<div class="h-[300px]" in:fade>
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
					c="choice"
					cRange={schemeTableau10}
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
			</div>
		{/if}
	</Card.Content>

	<Card.Footer>
		<p class="text-sm text-muted-foreground">
			created at {question.createdAt}
			{#if question.creator}by {question.creator.username}{/if}
		</p>
	</Card.Footer>
</Card.Root>
