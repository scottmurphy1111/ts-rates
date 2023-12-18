<script lang="ts">
	import JustDrive from '$lib/assets/icons/just-drive.svelte';
	import TsLogoDark from '$lib/assets/images/ts-logo-dark.svg';
	import TsLogo from '$lib/assets/images/ts-logo.svg';
	import type { PageData } from './$types';
	import type { Output, RatesheetWithIncludes } from '$lib/types/types';
	export let data: PageData;
	import { rawData } from '$lib/data/rawData';
	import { localStorageStore } from '@skeletonlabs/skeleton';
	import { getContext, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';

	const ratesheetStorage = localStorageStore('ratesheetId', 'test');
	const pendingStore = getContext<Writable<Boolean>>('pendingStore');

	let ratesheetData = {} as RatesheetWithIncludes;
	$: console.log('$ratesheetStorage', $ratesheetStorage);

	const ratesheet = async () => {
		pendingStore.set(true);

		await fetch(`/api/ratesheet?id=${$ratesheetStorage}`)
			.then((res) => res.json())
			.then((data) => {
				ratesheetData = data as RatesheetWithIncludes;
				pendingStore.set(false);
			});
	};

	$: console.log('ratesheetData', ratesheetData);

	onMount(async () => {
		await ratesheet();
	});

	const vscData = rawData as Record<string, any>;

	const output: Output = data?.output ?? { cardTypes: [], markup: '' };
</script>

{#if !$pendingStore && Object.keys(ratesheetData).length}
	<div class="flex flex-col">
		<header
			class="bg-gradient-to-br variant-gradient-primary-secondary p-8 w-full text-white inline-flex justify-between items-center gap-16"
		>
			<div class="w-full max-w-sm">
				<img class="" src={TsLogoDark} alt="ts-logo-dark" />
			</div>
			<div class="w-full">
				<h2 class="h2">
					{ratesheetData?.title}
				</h2>
				<h3 class="h3">
					{ratesheetData?.subtitle}
				</h3>
			</div>
		</header>
		<main>
			{#each ratesheetData?.rows as row}
				<div class="flex">
					<span class="text-2xl font-bold">{row.termValue}</span>
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
							<span class="text-2xl font-bold">{coverage.title}</span>
							<span class="text-lg">{coverage.description}</span>
						</div>
					</div>
				</div>
			{/each}
		</main>

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
						<div class="text-center font-bold text-xl">
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
						<div class="text-center font-bold text-xl">
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
			<h1 class="text-4xl font-bold text-center">Output</h1>
			<p class="text-center">This is the output page</p>
			<JustDrive />
		</div>
	{/each}
{/if}
