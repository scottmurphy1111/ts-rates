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
	import RatesOutput from './RatesOutput.svelte';
	import OptionsOutput from './OptionsOutput.svelte';
	import DisclosuresOutput from './DisclosuresOutput.svelte';
	import CoveragesOutput from './CoveragesOutput.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ output, ratesheet } = data);

	$: console.log('output', output);

	const ratesheetIdStorage = localStorageStore('ratesheetId', '');
	const colorStorage = localStorageStore('color', 'primary');

	$: colorFrom = `from-${output?.color}-500`;
	$: colorTo = `to-${output?.color}-900`;

	const pendingStore = getContext<Writable<Boolean>>('pendingStore');

	let ratesheetData = {} as RatesheetWithIncludes;

	// const ratesheet = async () => {
	// 	pendingStore.set(true);

	// 	try {
	// 		await fetch(`/api/ratesheet?id=${$ratesheetIdStorage}`)
	// 			.then((res) => {
	// 				pendingStore.set(false);
	// 				return res.json();
	// 			})
	// 			.then((data) => {
	// 				ratesheetData = data as RatesheetWithIncludes;
	// 			});
	// 	} catch (error) {
	// 		console.log('err', error);
	// 		pendingStore.set(false);
	// 	}
	// };

	// const rateOutput = async () => {
	// 	await fetch(`/api/rateOutput?id=${$ratesheetIdStorage}`)
	// 		.then((res) => {
	// 			pendingStore.set(false);
	// 			return res.json();
	// 		})
	// 		.then((data) => {
	// 			console.log('🤮 data', data);
	// 		});
	// };

	// onMount(async () => {
	// 	// await ratesheet();
	// 	await rateOutput();
	// 	pendingStore.set(false);

	// 	console.log('ratesheetData', ratesheetData);
	// 	console.log('rateOutput', rateOutput);
	// });
</script>

{#if ratesheet && output}
	{#if !$pendingStore && Object.keys(ratesheet).length}
		<div class="flex flex-col">
			<header
				class="bg-gradient-to-br {colorFrom} {colorTo} p-8 w-full text-white inline-flex justify-between items-center gap-16"
			>
				<div class="w-2/3 flex gap-4 items-center">
					{#if output?.logoUrl}
						<img class="w-1/2" src={output.logoUrl} alt="Custom Logo" />
					{/if}
					<a class="w-full" href="/">
						<img class="w-1/2" src={TsLogoDark} alt="ts-logo-dark" />
					</a>
				</div>
				<div class="w-1/3 ml-auto">
					<h2 class="h2">
						{ratesheet?.title}
					</h2>
					<h3 class="h3 font-semibold">
						{ratesheet?.subtitle}
					</h3>
				</div>
			</header>
			<main>
				<div class="flex flex-col gap-4 p-8 text-sm">
					<RatesOutput ratesheetData={ratesheet} />
					<OptionsOutput ratesheetData={ratesheet} />
					<DisclosuresOutput ratesheetData={ratesheet} color={output.color} />
					<CoveragesOutput ratesheetData={ratesheet} color={output.color} />
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
{/if}
