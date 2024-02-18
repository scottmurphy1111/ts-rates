<script lang="ts">
	import type { RatesheetWithIncludes } from '$lib/types/types';
	import type { Markup } from '@prisma/client';

	export let ratesheetData = {} as RatesheetWithIncludes;
	export let markups = [] as Markup[];
	export let color: string;

	$: formattedMarkups = markups.reduce(
		(acc, markup) => {
			acc[markup.termValue] = {
				markup: markup.markupValue
			};

			return acc;
		},
		{} as Record<string, { markup: string }>
	);
	const termHeaderVocation = () =>
		ratesheetData.lowMileageCutoff?.toLowerCase() === 'n/a'
			? `Term / Type  (All years / Unlimited Miles)`
			: `Term / Type (All years / 0 - ${ratesheetData.lowMileageCutoff}k miles)`;

	$: rateColHeadersVocational = [termHeaderVocation(), 'Cost', 'Deductible', 'Aggregate Limit'];

	const ratesHeadersCountVocational = (node: HTMLDivElement) => {
		node.style.gridTemplateColumns = `repeat(${rateColHeadersVocational.length}, minmax(min-content, auto))`;
	};

	const calculateMarkup = (termValue: string, cost: string) => {
		const markup = formattedMarkups[termValue]?.markup ?? 0;
		return Number(cost) + Number(markup);
	};

	$: formattedRows = ratesheetData.rows.sort((a, b) => {
		return (
			(String(b.truckType) > String(a.truckType)
				? 1
				: String(b.truckType) < String(a.truckType)
				  ? -1
				  : 0) || Number(a.costNewerLowMiles) - Number(b.costNewerLowMiles)
		);
	});
</script>

<div
	class={`grid justify-items-center place-items-end grid-flow-dense auto-rows-auto bg-${color}-500`}
	style="margin-inline: auto; margin-block: auto; gap: 2px;"
	use:ratesHeadersCountVocational
>
	{#each rateColHeadersVocational as header}
		<div
			class="flex flex-col text-base font-extrabold bg-white min-w-full px-2 pb-2 h-full justify-end"
		>
			{@html header}
		</div>
	{/each}
	{#if ratesheetData?.rows}
		{#each formattedRows as row, k}
			{#each Object.entries(row) as [key, value], i}
				{#if (key === 'costNewerLowMiles' || key === 'deductible' || key === 'aggregateLimit') && value !== null}
					<div
						class="inline-flex items-baseline text-base font-semibold bg-white min-w-full h-full p-2"
					>
						${new Intl.NumberFormat('en-US', {
							style: 'decimal',
							currency: 'USD'
						}).format(
							key.startsWith('cost') ? calculateMarkup(row.termValue, value) : Number(value)
						)}
					</div>
				{/if}
				{#if key === 'termValue'}
					<div
						class="inline-flex items-baseline text-base font-semibold bg-white min-w-full h-full p-2"
					>
						{value}
						{row['termUnit']} / {(
							row['truckType']?.charAt(0).toUpperCase() + (row['truckType'] ?? '').slice(1)
						).replace(/([A-Z])/g, ' $1')}
					</div>
				{/if}
			{/each}
		{/each}
	{/if}
</div>
