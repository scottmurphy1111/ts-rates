<script lang="ts">
	// import JustDrive from '$lib/assets/icons/just-drive.svelte';
	import TsLogoDark from '$lib/assets/images/ts-logo-dark.svg';
	// import TsLogo from '$lib/assets/images/ts-logo.svg';
	// import type { PageData } from './$types';
	import type { RatesheetWithIncludes } from '$lib/types/types';
	// import { rawData } from '$lib/data/rawData';
	import { localStorageStore } from '@skeletonlabs/skeleton';
	import { getContext, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';

	// export let data: PageData;

	const ratesheetIdStorage = localStorageStore('ratesheetId', '');
	const markupStorage = localStorageStore('markup', 0);

	const pendingStore = getContext<Writable<Boolean>>('pendingStore');

	let ratesheetData = {} as RatesheetWithIncludes;
	$: console.log('$ratesheetIdStorage', $ratesheetIdStorage);
	$: console.log('$markupStorage', $markupStorage);

	const ratesheet = async () => {
		pendingStore.set(true);

		try {
			await fetch(`/api/ratesheet?id=${$ratesheetIdStorage}`)
				.then((res) => {
					pendingStore.set(false);
					return res.json();
				})
				.then((data) => {
					ratesheetData = data as RatesheetWithIncludes;
				});
		} catch (error) {
			console.log('err', error);
			pendingStore.set(false);
		}
	};

	$: console.log('ratesheetData', ratesheetData);

	onMount(async () => {
		await ratesheet();
		pendingStore.set(false);
	});

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

	const optionColHeaders = ['Package', 'Term', 'Cost'];

	const ratesHeadersCount = (node: HTMLDivElement) => {
		node.style.gridTemplateColumns = `repeat(${rateColHeaders.length}, minmax(min-content, auto))`;
	};

	const optionsHeadersCount = (node: HTMLDivElement) => {
		node.style.gridTemplateColumns = `repeat(${
			optionColHeaders.length - 1
		}, minmax(250px, auto)) 3fr`;
	};
</script>

{#if !$pendingStore && Object.keys(ratesheetData).length}
	<div class="flex flex-col">
		<header
			class="bg-gradient-to-br variant-gradient-primary-secondary p-8 w-full text-white inline-flex justify-between items-center gap-16"
		>
			<div class="w-2/3">
				<img class="max-w-sm" src={TsLogoDark} alt="ts-logo-dark" />
			</div>
			<div class="w-1/3 ml-auto">
				<h2 class="h2">
					{ratesheetData?.title}
				</h2>
				<h3 class="h3 font-semibold">
					{ratesheetData?.subtitle}
				</h3>
			</div>
		</header>
		<main>
			<div class="flex flex-col gap-4 p-8">
				<!-- Rates -->
				<h2 class="h2 mb-4">Rates</h2>
				<div class="card shadow-xl p-8 mb-16">
					<div class="grid gap-2 place-content-stretch place-items-start" use:ratesHeadersCount>
						{#each rateColHeaders as header}
							<div class="flex flex-col gap-1 text-lg font-extrabold text-left">
								{@html header}
							</div>
						{/each}
						{#if ratesheetData?.rows}
							{#each ratesheetData.rows.sort((a, b) => Number(a.termValue) - Number(b.termValue)) as row, k}
								{#each Object.entries(row) as [key, value], i}
									{#if i !== 0 && key !== 'termValue' && key !== 'termUnit' && key !== 'mileageValue' && key !== 'ratesheetId' && typeof value === 'string'}
										<span class="inline-flex items-baseline gap-1 text-xl font-semibold">
											${new Intl.NumberFormat('en-US', {
												style: 'decimal',
												currency: 'USD'
											}).format(
												key.startsWith('cost') ? Number(value) + $markupStorage : Number(value)
											)}
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
										<span class="inline-flex items-baseline gap-1 text-xl font-semibold">
											{value}
											{row['termUnit']} / {row['mileageValue']}K
										</span>
									{/if}
								{/each}
							{/each}
						{/if}
					</div>
				</div>
				<!-- Options -->
				<h2 class="h2 mb-4">Options</h2>
				<div class="card shadow-xl p-8 mb-16">
					<div class="grid gap-2 place-content-end place-items-start" use:optionsHeadersCount>
						{#each optionColHeaders as header}
							<div class="flex flex-col gap-1 text-lg font-extrabold text-center">
								{@html header}
							</div>
						{/each}
						{#if ratesheetData?.options.sort((a, b) => {
							if (a.packageName > b.packageName) {
								return 1;
							}
							if (a.packageName < b.packageName) {
								return -1;
							}
							return 0 || Number(a.termValue) - Number(b.termValue);
						})}
							{#each ratesheetData.options as option}
								<span class="inline-flex items-baseline gap-1 text-xl font-semibold">
									{option.packageName}
								</span>
								<span class="inline-flex items-baseline gap-1 text-xl font-semibold">
									{option.termValue}
									{option.termValue === 'All' ? '' : option.termUnit}
								</span>
								<span class="inline-flex items-baseline gap-1 text-xl font-semibold">
									${new Intl.NumberFormat('en-US', {
										style: 'decimal',
										currency: 'USD'
									}).format(Number(option.cost))}
								</span>
							{/each}
						{/if}
					</div>
				</div>
				<!-- Disclosures -->
				<h2 class="h2 mb-4">Disclosures</h2>
				<div class="card shadow-xl p-8 mb-16">
					<div class="flex flex-col gap-8 items-start">
						{#each ratesheetData?.disclosuresSet.disclosures.sort((a, b) => Number(a.order) - Number(b.order)) as disclosure}
							<div class="flex flex-col gap-1 extrabold">
								<h3 class="h3 uppercase text-base text-primary-500 font-semibold">
									{@html disclosure.title}
								</h3>
								<p>{@html disclosure.description}</p>
							</div>
						{/each}
					</div>
				</div>
				<!-- Coverages -->
				<h2 class="h2 mb-4">Coverages</h2>
				<div class="card shadow-xl p-8 mb-16">
					<div class="flex flex-col gap-8 items-start">
						{#each ratesheetData?.coveragesSet.coverages.sort((a, b) => Number(a.order) - Number(b.order)) as coverage}
							<div class="flex flex-col gap-1 extrabold">
								<h3 class="h3 uppercase text-base text-primary-500 font-semibold">
									{@html coverage.title}
								</h3>
								<p>{@html coverage.description}</p>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</main>
		<!-- {#each ratesheetData?.rows as row}
				<div class="flex">
					<span class="text-2xl font-extrabold">{row.termValue}</span>
					<span class="text-lg">{row.termUnit}</span>
					<span class="text-lg">{row.mileageValue}</span>
					<span class="text-lg">{row.costNewerLowMiles}</span>
					<span class="text-lg">{row.costNewerHighMiles}</span>
					<span class="text-lg">{row.costOlderLowMiles}</span>
					<span class="text-lg">{row.costOlderHighMiles}</span>
					<span class="text-lg">{row.deductible}</span>
					<span class="text-lg">{row.aggregateLimit}</span>
				</div>
			{/each}
			{#each ratesheetData?.coveragesSet?.coverages as coverage}
				<div class="flex flex-col">
					<div class="flex flex-col">
						<div class="flex flex-col">
							<span class="text-2xl font-extrabold">{coverage.title}</span>
							<span class="text-lg">{coverage.description}</span>
						</div>
					</div>
				</div>
			{/each}

		{ratesheetData?.id}
		{ratesheetData?.name}
		{ratesheetData?.subtitle}
	</div>

	{#each output?.cardTypes as cardType}
		<div class="flex flex-col items-center justify-center w-full h-full">
			<div class="flex items-center justify-between w-full p-4 bg-ts-blue bg-opacity-80">
				<div class="w-80 flex flex-col relative">
					{#if output?.customLogo}
						<img class="w-full" src={output.customLogo} alt="Custom Logo" />
					{:else}
						<img class="w-full" src={TsLogo} alt="TruckSuite Logo" />
						<span class="text-right text-white relative bottom-1 -right-5"
							>Vehicle Service Contracts</span
						>
					{/if}
				</div>
				<div class="flex flex-col text-white uppercase">
					<span class="font-semibold text-xl">
						{vscData[cardType]?.header?.title}
					</span>
				</div>
			</div>
			<div class="flex w-full p-4">
				<div class="flex justify-between w-3/4 bg-ts-gray-md p-4 rounded">
					<div class="flex flex-col items-center">
						<div class="text-center font-extrabold text-xl">
							{@html vscData[cardType]?.body?.standards?.preheader}
						</div>

						<div class="grid grid-cols-4 gap-2 justify-center items-center text-lg font-medium">
							{#each vscData[cardType]?.body?.standards?.standardHeaders as header}
								<div class="text-center">
									<div class="flex flex-col">
										{@html header.main}
										{#if header?.subHeaders}
											{#each header.subHeaders as subHeader}
												<span>{@html subHeader}</span>
											{/each}
										{/if}
									</div>
								</div>
							{/each}
						</div>
					</div>
					<div class="flex flex-col items-center">
						<div class="text-center font-extrabold text-xl">
							{@html vscData[cardType]?.body?.options?.preheader}
						</div>
						<div class="grid grid-cols-3 gap-2 justify-center items-center">
							{#each vscData[cardType]?.body?.options?.optionalHeaders as header}
								<div class="text-center">
									<div class="flex flex-col">
										{@html header.main}
										{#if header?.subHeaders}
											{#each header.subHeaders as subHeader}
												<span>{@html subHeader}</span>
											{/each}
										{/if}
									</div>
								</div>
							{/each}
						</div>
					</div>
				</div>
				<div class="flex flex-col w-1/4">other text</div>
			</div>
			<h1 class="text-4xl font-extrabold text-center">Output</h1>
			<p class="text-center">This is the output page</p>
			<JustDrive />
      {/each} -->
	</div>
{/if}
