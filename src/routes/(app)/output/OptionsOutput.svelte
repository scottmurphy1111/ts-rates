<script lang="ts">
	import { localStorageStore } from '@skeletonlabs/skeleton';
	import type { RatesheetWithIncludes } from '$lib/types/types';

	export let ratesheetData = {} as RatesheetWithIncludes;

	$: console.log(ratesheetData);
	const colorStorage = localStorageStore('color', 'primary');
	let colorText = `text-${$colorStorage}-500`;

	$: groupOptionsByPackage = ratesheetData?.options?.reduce(
		(acc, option) => {
			const key = option.packageName;
			if (!acc[key]) {
				acc[key] = [
					{
						termValue: option.termValue,
						termUnit: option.termUnit,
						cost: option.cost
					}
				];
			} else {
				acc[key] = [
					...acc[key],
					{
						termValue: option.termValue,
						termUnit: option.termUnit,
						cost: option.cost
					}
				];
			}

			acc[key] = acc[key].sort((a, b) => Number(a.termValue) - Number(b.termValue));
			return acc;
		},
		{} as Record<string, Record<string, string>[]>
	);

	$: groupOptionsByTerm = ratesheetData?.options?.reduce(
		(acc, option) => {
			const key = option.termValue;
			if (!acc[key]) {
				acc[key] = [
					{
						packageName: option.packageName,
						termValue: option.termValue,
						termUnit: option.termUnit,
						cost: option.cost
					}
				];
			} else {
				acc[key] = [
					...acc[key],
					{
						packageName: option.packageName,
						termValue: option.termValue,
						termUnit: option.termUnit,
						cost: option.cost
					}
				];
			}

			acc[key] = acc[key].sort((a, b) => Number(a.termValue) - Number(b.termValue));
			acc = Object.entries(acc).reduce(
				(acc, [key, value]) => {
					acc[key] = value.sort((a, b) => {
						if (a.packageName > b.packageName) {
							return 1;
						}
						if (a.packageName < b.packageName) {
							return -1;
						}
						return 0;
					});

					return acc;
				},
				{} as Record<string, Record<string, string>[]>
			);

			return acc;
		},
		{} as Record<string, Record<string, string>[]>
	);

	$: console.log('groupOptionsByPackage', groupOptionsByPackage);
	$: console.log('groupOptionsByTerm', groupOptionsByTerm);

	$: optionsHeadersCount = (node: HTMLDivElement) => {
		// get count of non All options plus 1 for empty first column
		const count = Object.entries(groupOptionsByPackage).reduce((acc, [key, value]) => {
			if (value[0].termValue !== 'All') {
				acc = acc + 1;
			}

			return acc;
		}, 1);

		node.style.gridTemplateColumns = `repeat(${count}, minmax(150px, 200px))`;
	};
</script>

<!-- Options -->
<h3 class="h3 text-2xl font-semibold mb-2">Options</h3>
<div class="card shadow-xl flex p-8 mb-8 w-min">
	<div
		class="grid gap-4 justify-items-center border-ts-gray-md"
		class:border-r={groupOptionsByTerm['All']}
		use:optionsHeadersCount
	>
		<div class="flex flex-col gap-1 text-base font-extrabold text-center">Term Lengths</div>
		{#each Object.entries(groupOptionsByPackage).sort((a, b) => {
			if (a[0] > b[0]) {
				return 1;
			}
			if (a[0] < b[0]) {
				return -1;
			}
			return 0;
		}) as [key, value], i}
			{#if value[0].termValue !== 'All'}
				<div class="flex flex-col gap-1 text-base font-extrabold text-center">
					{@html key}
				</div>
			{/if}
		{/each}
		{#each Object.entries(groupOptionsByTerm) as [key, val]}
			{#if key !== 'All'}
				{#each val as option, idx}
					{#if idx === 0}
						<span class="inline-flex items-baseline gap-1 text-base font-semibold">
							{option.termValue}
							{option.termValue === 'All' ? '' : option.termUnit}
						</span>
					{/if}
					<span class="inline-flex items-baseline gap-1 text-base font-semibold">
						${new Intl.NumberFormat('en-US', {
							style: 'decimal',
							currency: 'USD'
						}).format(Number(option.cost))}
					</span>
				{/each}
			{/if}
		{/each}
	</div>
	{#if groupOptionsByTerm['All']}
		<div class="flex flex-col gap-4 pl-8">
			<div class="flex flex-col gap-1 text-base font-extrabold text-center whitespace-nowrap">
				All Terms
			</div>
			<div class="flex flex-col gap-1 text-base font-semibold text-center whitespace-nowrap">
				{groupOptionsByTerm['All'][0].packageName} - ${new Intl.NumberFormat('en-US', {
					style: 'decimal',
					currency: 'USD'
				}).format(Number(groupOptionsByTerm['All'][0].cost))}
			</div>
		</div>
	{/if}
</div>
