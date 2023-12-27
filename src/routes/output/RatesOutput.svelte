<script lang="ts">
	import { localStorageStore } from '@skeletonlabs/skeleton';
	import type { RatesheetWithIncludes } from '$lib/types/types';

	export let ratesheetData = {} as RatesheetWithIncludes;

	const markupStorage = localStorageStore('markup', 0);
	const colorStorage = localStorageStore('color', 'primary');
	let colorText = `text-${$colorStorage}-500`;

	$: rateColHeaders = [
		'Term / Mileage Limits',
		// 'Mileage',
		`${new Date().getFullYear() - 4} &amp; Newer / 0-${ratesheetData.lowMileageCutoff}K`,
		`${new Date().getFullYear() - 4} &amp; Newer / ${ratesheetData.lowMileageCutoff}K+`,
		`${new Date().getFullYear() - 5} &amp; Older / 0-${ratesheetData.lowMileageCutoff}K`,
		`${new Date().getFullYear() - 5} &amp; Older / ${ratesheetData.lowMileageCutoff}K+`,
		'Deductible',
		'Aggregate Limit'
	];

	const ratesHeadersCount = (node: HTMLDivElement) => {
		node.style.gridTemplateColumns = `repeat(${rateColHeaders.length}, minmax(min-content, auto))`;
	};
</script>

<!-- Rates -->
<h3 class="h3 text-2xl font-semibold mb-2">Rates</h3>
<div class="card shadow-xl p-8 mb-8">
	<div class="grid gap-4 justify-items-center" use:ratesHeadersCount>
		{#each rateColHeaders as header}
			<div class="flex flex-col gap-1 text-base font-extrabold text-center">
				{@html header}
			</div>
		{/each}
		{#if ratesheetData?.rows}
			{#each ratesheetData.rows.sort((a, b) => Number(a.termValue) - Number(b.termValue)) as row, k}
				{#each Object.entries(row) as [key, value], i}
					{#if i !== 0 && key !== 'termValue' && key !== 'termUnit' && key !== 'mileageValue' && key !== 'ratesheetId' && typeof value === 'string'}
						<span class="inline-flex items-baseline gap-1 text-base font-semibold">
							${new Intl.NumberFormat('en-US', {
								style: 'decimal',
								currency: 'USD'
							}).format(key.startsWith('cost') ? Number(value) + $markupStorage : Number(value))}
						</span>

						<!-- {#if key === 'termUnit'}
          <span class="inline-flex items-baseline gap-1">
            <select class="input" name={`${key}`} {value}>
              <option value="days">days</option>
              <option value="months">months</option>
            </select>
          </span>
        {/if} -->
					{/if}
					{#if key === 'termValue'}
						<span class="inline-flex items-baseline gap-1 text-base font-semibold">
							{value}
							{row['termUnit']} / {row['mileageValue']}K
						</span>
					{/if}
				{/each}
			{/each}
		{/if}
	</div>
</div>
