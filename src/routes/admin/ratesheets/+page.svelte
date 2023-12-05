<script lang="ts">
	import { enhance } from '$app/forms';
	import { page, updated } from '$app/stores';
	import type { ActionData, PageData } from './$types';
	import { writable } from 'svelte/store';
	import LabelInput from '$lib/components/LabelInput.svelte';
	import { invalidate, invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { Action } from '@sveltejs/kit';
	import SaveIcon from '$lib/assets/icons/save.svelte';
	import DeleteIcon from '$lib/assets/icons/delete.svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { RatesheetsWithIncludes } from '$lib/types/types';
	import Rates from './Rates.svelte';
	import Options from './Options.svelte';
	import { getToastStore } from '@skeletonlabs/skeleton';

	export let data: PageData;
	export let form: ActionData;

	const toastStore = getToastStore();
	// console.log('data', data);
	// $: console.log('form', form);

	$: ({ ratesheets } = data);
	$: ratesheet = form?.ratesheet ?? null;

	$: console.log('🙆‍♀️ ratesheet', ratesheet);

	// $: selectedRatesheet = form?.ratesheet?.name ?? '';

	// console.log('selectedRatesheet', selectedRatesheet);
</script>

<form method="POST" action="?/selectRatesheet" use:enhance>
	<div class="flex gap-2 p-8">
		<select
			class="select"
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
		<button class="btn variant-filled-primary dark:variant-ghost-primary w-[240px]"
			>Change Selection</button
		>
	</div>
</form>

<!-- {$currentRatesheet} -->
{#if ratesheet}
	<div class="flex flex-col gap-4 p-8">
		<form
			method="POST"
			action="?/updateTitle"
			use:enhance={() => {
				return async ({ update, result }) => {
					await update();
					if (result.status === 200) {
						toastStore.trigger({ message: '👍 Title updated successfully' });
						await invalidate('data:ratesheets');
					} else {
						toastStore.trigger({ message: 'Error updating title❗️' });
					}
				};
			}}
		>
			<div class="flex gap-4 items-end">
				<input type="hidden" name="id" value={ratesheet.id} />
				<label for="name" class="label"
					>Name
					<input class="input" type="text" name="name" disabled value={ratesheet.name} /></label
				>
				<label for="title" class="label"
					>Title
					<input class="input" type="text" name="title" value={ratesheet.title} />
				</label>
				<label for="subtitle" class="label w-full"
					>Subtitle
					<input class="input" type="text" name="subtitle" value={ratesheet.subtitle} />
				</label>
				<span class="inline-flex mb-2">
					<button class="btn-icon text-primary-500 dark:text-white w-6 h-6"
						><svelte:component this={SaveIcon} /></button
					>
				</span>
				<!-- <button class="btn btn-secondary w-24">Cancel</button> -->
			</div>
		</form>

		<div class="flex flex-col gap-8">
			<Rates {ratesheet} />
			<Options {ratesheet} />
			<div class="flex flex-col gap-2">
				<h2 class="h2">Disclosures</h2>
				<div class="flex flex-col gap-8">
					{#if ratesheet?.disclosuresSet}
						{JSON.stringify(ratesheet?.disclosuresSet)}
					{/if}
					{#if ratesheet?.disclosuresSet.disclosures}
						{#each ratesheet?.disclosuresSet.disclosures as disclosure, i}
							<div class="flex flex-col gap-2">
								<input
									type="text"
									class="input p-2"
									name={`disclosureTitle`}
									value={disclosure.title}
								/>
								<textarea
									class="textarea"
									name={`disclosureDescription`}
									value={disclosure.description}
								/>
							</div>
						{/each}
					{/if}
				</div>
			</div>
			<div class="flex flex-col gap-2">
				<h2 class="h2">Coverages</h2>
				<div class="flex flex-col gap-8">
					{#if ratesheet?.coverages}
						{#each ratesheet?.coverages as coverage, i}
							<div class="flex flex-col gap-2">
								<input type="text" class="input" name={`coverageTitle`} value={coverage.title} />
								<textarea
									class="textarea"
									name={`coverageDescription`}
									value={coverage.description}
								/>
							</div>
						{/each}
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}
