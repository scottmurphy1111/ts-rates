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

	$: rateColHeaders = [
		'Term / Mileage Limits',
		`${new Date().getFullYear() - 4} &amp; Newer <br /> 0-${ratesheetData.lowMileageCutoff}K`,
		`${new Date().getFullYear() - 4} &amp; Newer <br /> ${ratesheetData.lowMileageCutoff}K+`,
		`${new Date().getFullYear() - 5} &amp; Older <br /> 0-${ratesheetData.lowMileageCutoff}K`,
		`${new Date().getFullYear() - 5} &amp; Older <br /> ${ratesheetData.lowMileageCutoff}K+`,
		'Deductible',
		'Aggregate Limit'
	];

	$: rateColHeadersVocational = [termHeaderVocation(), 'Cost', 'Deductible', 'Aggregate Limit'];

	const ratesHeadersCount = (node: HTMLDivElement) => {
		node.style.gridTemplateColumns = `repeat(${rateColHeaders.length}, minmax(min-content, auto))`;
	};
	const ratesHeadersCountVocational = (node: HTMLDivElement) => {
		node.style.gridTemplateColumns = `repeat(${rateColHeadersVocational.length}, minmax(min-content, auto))`;
	};

	const calculateMarkup = (termValue: string, cost: string) => {
		const markup = formattedMarkups[termValue]?.markup ?? 0;
		return Number(cost) + Number(markup);
	};
</script>

<!-- Rates -->
<h3 class="h3 text-2xl font-semibold mb-2">Rates</h3>
<div class="card shadow-xl p-8 mb-8">
	<!-- Vocational -->
	{#if ratesheetData?.isVocational}
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
				{#each ratesheetData.rows.sort((a, b) => (String(b.truckType) > String(a.truckType) ? 1 : String(b.truckType) < String(a.truckType) ? -1 : 0) || Number(a.costNewerLowMiles) - Number(b.costNewerLowMiles)) as row, k}
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

						<!-- {#if i !== 0}
							key {key}<br />
							value {value} <br />
							i {i} <br />
						{/if} -->
					{/each}
				{/each}
			{/if}
		</div>

		<!-- Non Vocational -->
	{:else}
		<div
			class={`grid justify-items-center place-items-end grid-flow-dense auto-rows-auto bg-${color}-500`}
			style="margin-inline: auto; margin-block: auto; gap: 2px;"
			use:ratesHeadersCount
		>
			{#each rateColHeaders as header}
				<div
					class="flex flex-col text-base font-extrabold bg-white min-w-full px-2 pb-2 h-full justify-end"
				>
					{@html header}
				</div>
			{/each}
			{#if ratesheetData?.rows}
				{#each ratesheetData.rows.sort((a, b) => Number(a.termValue) - Number(b.termValue) || Number(a.mileageValue) - Number(b.mileageValue)) as row, k}
					{#each Object.entries(row) as [key, value], i}
						{#if i !== 0 && key !== 'termValue' && key !== 'termUnit' && key !== 'mileageValue' && key !== 'ratesheetId' && typeof value === 'string'}
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
								{row['termUnit']} / {row['mileageValue']}K
							</div>
						{/if}
					{/each}
				{/each}
			{/if}
		</div>
	{/if}
</div>
