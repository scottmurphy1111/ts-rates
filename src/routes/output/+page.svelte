<script lang="ts">
	import JustDrive from '$lib/assets/icons/just-drive.svelte';
	import TruckSuiteLogo from '$lib/assets/images/ts-logo-dark.svg';

	import { writable } from 'svelte/store';
	import type { PageData } from './$types';
	import type { Output } from '$lib/types/types';
	export let data: PageData;
	import { rawData } from '$lib/data/rawData';

	const vscData = rawData as Record<string, any>;

	const output: Output = data?.output ?? { cardTypes: [], markup: '' };

	$: console.log('output', output);
</script>

{#each output?.cardTypes as cardType}
	<div class="flex flex-col items-center justify-center w-full h-full">
		<div class="flex items-center justify-between w-full p-4 bg-ts-blue bg-opacity-80">
			<div class="w-80 flex flex-col relative">
				{#if output?.customLogo}
					<img class="w-full" src={output.customLogo} alt="Custom Logo" />
				{:else}
					<img class="w-full" src={TruckSuiteLogo} alt="TruckSuite Logo" />
					<span class="text-right text-white relative bottom-1 -right-5"
						>Vehicle Service Contracts</span
					>
				{/if}
			</div>
			<div class="flex flex-col text-white uppercase">
				<span class="font-semibold text-xl">
					{vscData[cardType]?.header?.title}
				</span>
				<!-- <span class="text-base">
					{vscData[cardType]?.header?.subtitle}
				</span> -->
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
		<!-- <p>{data.cardTypes}</p>
    <p>{data.markup}</p> -->
		<JustDrive />
	</div>
{/each}
