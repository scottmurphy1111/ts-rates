<script lang="ts">
	import { enhance } from '$app/forms';
	import { page, updated } from '$app/stores';
	import type { ActionData, PageData } from './$types';
	import { writable } from 'svelte/store';
	import LabelInput from '$lib/components/LabelInput.svelte';
	import { invalidate, invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { Action } from '@sveltejs/kit';

	export let data: PageData;
	export let form: ActionData;

	export let numCols = 0;

	console.log('data', data);
	$: console.log('form', form);

	$: ({ ratesheets } = data);
	$: ratesheet = form?.ratesheet ?? null;

	$: console.log('🙆‍♀️ ratesheet', ratesheet);

	// $: selectedRatesheet = form?.ratesheet?.name ?? '';

	// console.log('selectedRatesheet', selectedRatesheet);

	const rateColHeaders = [
		'Term',
		'Units',
		'Mileage',
		// 'Cost Newer Low Miles',
		`${new Date().getFullYear()} - ${new Date().getFullYear() - 4} <br /> 0-600k`,
		`${new Date().getFullYear()} - ${new Date().getFullYear() - 4} <br /> 600k+`,
		`${new Date().getFullYear() - 5} &amp; older <br /> 0-600k`,
		`${new Date().getFullYear() - 5} &amp; older <br /> 600k+`,
		// 'Cost Newer High Miles',
		// 'Cost Older Low Miles',
		// 'Cost Older High Miles',
		'Deductible',
		'Aggregate',
		''
	];

	const optionColHeaders = ['Package', 'Term', 'Units', 'Cost'];

	onMount(() => {
		console.log('mounted');
		numCols = rateColHeaders.length;
	});

	let emptyRatesRow: ArrayLike<unknown> | { [s: string]: unknown } | undefined = undefined;
	const addNewRow = () => {
		emptyRatesRow = {
			termValue: '',
			termUnit: 'months',
			mileageValue: '',
			costNewerLowMiles: '',
			costNewerHighMiles: '',
			costOlderLowMiles: '',
			costOlderHighMiles: '',
			deductible: '',
			aggregateLimit: ''
		};
	};
</script>

<form
	method="POST"
	action="?/selectRatesheet"
	use:enhance={() => {
		return async ({ update }) => {
			await update();
			// selectedRatesheet = form?.ratesheet?.name ?? '';
		};
	}}
>
	<div class="flex gap-2 p-8">
		<select
			class="border rounded border-ts-gray-md w-full px-2"
			name="selectedRatesheet"
			value={ratesheet?.name ? ratesheet?.name : ratesheets[0]?.name}
		>
			{#if ratesheets}
				<option disabled hidden value>select ratesheet</option>
				{#each ratesheets as sheet}
					<option value={sheet.name} selected={sheet.name === ratesheet?.name}>
						{sheet.name}
					</option>
				{/each}
			{/if}
		</select>
		<button class="btn btn-primary w-[240px]">Change Selection</button>
	</div>
</form>

<!-- {$currentRatesheet} -->
{#if ratesheet}
	<div class="flex flex-col gap-2 p-8">
		<form
			method="POST"
			action="?/updateRatesheet"
			use:enhance={() => {
				return async ({ update }) => {
					await update();
					await invalidate('data:ratesheets');
					// selectedRatesheet = ratesheet?.name ?? '';
				};
			}}
		>
			<div class="flex gap-8 items-baseline">
				<input type="hidden" name="id" value={ratesheet.id} />
				<label for="name">
					<span class="text-sm font-semibold">Name</span>
					<input type="text" name="name" disabled value={ratesheet.name} />
				</label>
				<h1 class="h1">
					<span class="text-sm font-semibold">Title</span>
					<input
						class="border-b border-ts-gray-md"
						type="text"
						name="title"
						value={ratesheet.title}
					/>
				</h1>
				<div class="ml-auto">
					<button class="btn btn-primary w-24">Save</button>
					<button class="btn btn-secondary w-24">Cancel</button>
				</div>
			</div>

			<div class="flex flex-col gap-8">
				<h2 class="h2">Rates</h2>

				<div class="grid gap-2 items-end" style={`grid-template-columns: repeat(${numCols}, 1fr)`}>
					{#each rateColHeaders as header}
						<div class="flex flex-col gap-1 font-semibold">
							{@html header}
						</div>
					{/each}
					{#if ratesheet?.rows}
						{#each ratesheet.rows as row, k}
							<form
								method="post"
								action={`?/updateRow=${row.id}`}
								style="display:contents"
								use:enhance
							>
								{#each Object.entries(row) as [key, value], i}
									<input type="hidden" name="id" value={row.id} style="display:none" />

									{#if i !== 0}
										{#if key !== 'termUnit' && key !== 'ratesheetId' && typeof value === 'string'}
											<span class="inline-flex items-baseline gap-1">
												<input
													size={key === 'mileageValue' ? 3 : 10}
													class="border-b border-ts-gray-md"
													type="text"
													name={`${key}`}
													{value}
												/>
												{#if key === 'mileageValue'}
													<span>000</span>
												{/if}
											</span>
										{/if}

										{#if key === 'termUnit'}
											<span class="inline-flex items-baseline gap-1">
												<select class="border-b border-ts-gray-md" name={`${key}`} {value}>
													<option value="days">days</option>
													<option value="months">months</option>
												</select>
											</span>
										{/if}
									{/if}
								{/each}
								<div>
									<button>Save Row</button>
								</div>
							</form>
						{/each}
					{/if}
					{#if emptyRatesRow}
						<form
							method="post"
							action={`?/createRow`}
							style="display:contents"
							use:enhance={() => {
								return async ({ update }) => {
									await update();
									await invalidate('data:ratesheets');
									emptyRatesRow = undefined;
									// selectedRatesheet = ratesheet?.name ?? '';
								};
							}}
						>
							<input type="hidden" name="ratesheetId" value={ratesheet.id} style="display:none" />

							{#each Object.entries(emptyRatesRow) as [key, value], i}
								<!-- <input type="hidden" name="id" value={emptyRatesRow.id} style="display:none" /> -->

								{#if key !== 'termUnit' && key !== 'ratesheetId' && typeof value === 'string'}
									<span class="inline-flex items-baseline gap-1">
										<input
											size={key === 'mileageValue' ? 3 : 10}
											class="border-b border-ts-gray-md"
											type="text"
											name={`${key}`}
											{value}
										/>
										{#if key === 'mileageValue'}
											<span>000</span>
										{/if}
									</span>
								{/if}

								{#if key === 'termUnit'}
									<span class="inline-flex items-baseline gap-1">
										<select class="border-b border-ts-gray-md" name={`${key}`} {value}>
											<option value="days">days</option>
											<option value="months">months</option>
										</select>
									</span>
								{/if}
							{/each}
							<div>
								<button>Save Row</button>
							</div>
						</form>
					{/if}
				</div>
				<div>
					<button class="btn btn-primary" on:click={addNewRow}>+ Add New</button>
				</div>

				<h2 class="h2">Options</h2>
				<div class={`grid grid-cols-4 gap-2`}>
					{#each optionColHeaders as header}
						<div class="flex flex-col gap-1 font-semibold">
							{header}
						</div>
					{/each}
					{#if ratesheet?.options}
						{#each ratesheet.options as option, i}
							<select
								class="border-b border-ts-gray-md"
								name={`optionPackage`}
								value={option.package}
							>
								<option value="Trans&Diff">Trans&Diff</option>
								<option value="HVAC">HVAC</option>
								<option value="APU">APU</option>
								<option value="Refrigeration">Refrigeration</option>
							</select>
							{#each option.details as detail}
								<input
									type="text"
									class="border-b border-ts-gray-md rounded p-2"
									name={`optionTermValue`}
									value={detail.termValue}
								/>
								<select
									class="border-b border-ts-gray-md"
									name={`optionTermUnit`}
									value={detail.termUnit}
								>
									<option value="days">days</option>
									<option value="months">months</option>
								</select>
								<input
									type="text"
									class="border-b border-ts-gray-md rounded p-2"
									name={`optionCost`}
									value={detail.cost}
								/>
							{/each}
						{/each}
					{/if}
				</div>
				<h2 class="h2">Disclosures</h2>
				<div class="flex flex-col gap-8">
					{#if ratesheet?.disclosures}
						{#each ratesheet?.disclosures as disclosure, i}
							<div class="flex flex-col gap-2">
								<input
									type="text"
									class="border-b border-ts-gray-md p-2"
									name={`disclosureTitle`}
									value={disclosure.title}
								/>
								<textarea
									class="border border-ts-gray-md rounded p-2"
									name={`disclosureDescription`}
									value={disclosure.description}
								/>
							</div>
						{/each}
					{/if}
				</div>
				<h2 class="h2">Coverages</h2>
				<div class="flex flex-col gap-8">
					{#if ratesheet?.coverages}
						{#each ratesheet?.coverages as coverage, i}
							<div class="flex flex-col gap-2">
								<input
									type="text"
									class="border-b border-ts-gray-md p-2"
									name={`coverageTitle`}
									value={coverage.title}
								/>
								<textarea
									class="border border-ts-gray-md rounded p-2"
									name={`coverageDescription`}
									value={coverage.description}
								/>
							</div>
						{/each}
					{/if}
				</div>
			</div>
		</form>
	</div>
{/if}
