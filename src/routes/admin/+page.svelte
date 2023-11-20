<script lang="ts">
	import { enhance } from '$app/forms';
	import { page, updated } from '$app/stores';
	import type { Ratesheet } from '@prisma/client';
	import type { ActionData, PageData } from './$types';
	import { writable } from 'svelte/store';
	import LabelInput from '$lib/components/LabelInput.svelte';

	export let data: PageData;
	export let form: ActionData;

	const { ratesheets } = data;

	let selectedRatesheet = '';
</script>

<form
	method="POST"
	action="?/selectRatesheet"
	use:enhance={() => {
		return async ({ update }) => {
			update();
			selectedRatesheet = '';
		};
	}}
>
	<div class="flex gap-2 p-8">
		<select
			class="border rounded border-ts-gray-md w-full px-2"
			name="selectedRatesheet"
			bind:value={selectedRatesheet}
		>
			{#if ratesheets}
				<!-- promise is pending -->

				<!-- promise was fulfilled -->
				<option disabled hidden value>select ratesheet</option>
				{#each ratesheets as sheet}
					<option selected={sheet.name === selectedRatesheet} value={sheet.name}
						>{sheet.name}</option
					>
				{/each}
			{/if}
		</select>
		<button class="btn btn-primary w-[240px]">Change Selection</button>
	</div>
</form>

<!-- {$currentRatesheet} -->
{#if form?.ratesheet}
	<div class="flex flex-col gap-2 p-8">
		<h1 class="h1">{form?.ratesheet?.name}</h1>
		<h2 class="h2">Rates</h2>
		<div class="flex gap-2">
			{#each form.ratesheet.rows as row}
				{#each Object.entries(row) as [key, value], i}
					<!-- // skip the first column, id -->
					{#if i !== 0}
						{#if typeof value === 'string'}
							<LabelInput label={key} placeholder={value} name={key} {value} />
						{/if}
						{#if typeof value === 'boolean'}
							<label class="flex flex-col gap-1 font-semibold text-base" for={key}
								>{key}
								<input
									type="checkbox"
									class="border border-ts-gray-md rounded w-4 h-4"
									{value}
									name={key}
									checked={value}
								/>
							</label>
						{/if}
					{/if}
				{/each}
			{/each}
		</div>
		<h2 class="h2">Disclosures</h2>
		<div class="flex gap-2">
			{#each form.ratesheet.disclosures as disclosure, i}
				<LabelInput label="Title" name="title" value={disclosure.title} placeholder={undefined} />
				<label for="description" class="flex flex-col gap-1 font-semibold text-base"
					>Description
					<textarea
						class="border border-ts-gray-md rounded py-3 px-4"
						name="description"
						value={disclosure.description}
					/>
				</label>
				<!-- <textarea label={option.name} placeholder={option.value} name={option.name} {value} /> -->
			{/each}
		</div>
		<h2 class="h2">Coverages</h2>
		<div class="flex gap-2">
			{#each form.ratesheet.coverages as coverage}
				{#each Object.entries(coverage) as [key, value], i}
					{#if i !== 0}
						<LabelInput label={key} placeholder={String(value)} name={key} value={String(value)} />
						<!-- <textarea label={coverage.name} placeholder={coverage.value} name={coverage.name} {value} /> -->
					{/if}
				{/each}
			{/each}
		</div>

		<pre>{JSON.stringify(form?.ratesheet ?? ratesheets[0], null, 2)}</pre>
	</div>
{/if}
