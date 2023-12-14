<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';
	import { writable } from 'svelte/store';
	import { invalidate } from '$app/navigation';
	import { setContext } from 'svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { RatesheetWithIncludes } from '$lib/types/types';
	import Rates from './Rates.svelte';
	import Options from './Options.svelte';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import DisclosuresSets from './DisclosuresSets.svelte';
	import CoveragesSets from './CoveragesSets.svelte';
	import type { Row, Option } from '@prisma/client';

	export let data: PageData;
	export let form: ActionData;

	let selectForm: HTMLFormElement;

	const toastStore = getToastStore();
	const modalStore = getModalStore();

	const creatingRatesheetStore = writable<boolean>(false);
	const emptyRatesRowStore = writable<Row | undefined>(undefined);
	const emptyOptionsRowStore = writable<Option | undefined>(undefined);

	setContext('creatingRatesheetStore', creatingRatesheetStore);
	setContext('emptyRatesRowStore', emptyRatesRowStore);
	setContext('emptyOptionsRowStore', emptyOptionsRowStore);

	$: ({ ratesheets, disclosuresSets, coveragesSets } = data);
	$: ratesheet = form?.ratesheet ?? null;

	$: selectedRatesheet = ratesheet?.id ?? '';

	let emptyRatesheet: RatesheetWithIncludes = {
		id: 'new',
		name: '',
		title: '',
		subtitle: '',
		rows: [],
		options: [],
		disclosuresSetId: '',
		disclosuresSet: {
			id: '',
			name: '',
			disclosures: []
		},
		coveragesSetId: '',
		coveragesSet: {
			id: '',
			name: '',
			coverages: []
		}
	};

	const resetEmptyRows = () => {
		emptyRatesRowStore.set(undefined);
		emptyOptionsRowStore.set(undefined);
	};

	const createEmptyRatesheet = () => {
		ratesheet = emptyRatesheet;
		creatingRatesheetStore.set(true);
	};

	const handleSubmit = async (e: Event) => {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);

		await fetch('/api/ratesheets', {
			method: 'POST',
			body: formData
		})
			.then(async (res) => {
				if (res.ok) {
					ratesheet = (await res.json()) as RatesheetWithIncludes;
					invalidate('data:ratesheets');
					toastStore.trigger({ message: '👍 Ratesheet updated successfully' });
					resetEmptyRows();
					creatingRatesheetStore.set(false);
				}
			})
			.catch((err) => {
				toastStore.trigger({ message: `❗️ Error updating Ratesheet ${err}` });
			});
	};

	const deleteRatesheet = () => {
		new Promise<boolean>((resolve) => {
			modalStore.trigger({
				type: 'confirm',
				// Data
				title: 'Confirm Delete',
				body: 'Are you sure you wish to delete this ratesheet (this is irreversible)?',
				// TRUE if confirm pressed, FALSE if cancel pressed
				response: (r: boolean) => {
					resolve(r);
				}
			});
		}).then(async (r) => {
			if (!r) return;

			await fetch(`/api/ratesheets?id=${ratesheet?.id}`, {
				method: 'DELETE'
			})
				.then(async (res) => {
					if (res.ok) {
						const json = await res.json();
						toastStore.trigger({ message: '👍 Ratesheet deleted successfully' });
						invalidate('data:ratesheets');
						ratesheet = null;
					}
				})
				.catch((err) => {
					toastStore.trigger({ message: `❗️ Error deleting ratesheet ${err}` });
				});
		});
	};
</script>

<form
	method="POST"
	action="?/selectRatesheet"
	bind:this={selectForm}
	use:enhance={() => {
		return async ({ update }) => {
			await update();
			emptyRatesheet = {
				id: 'new',
				name: '',
				title: '',
				subtitle: '',
				rows: [],
				options: [],
				disclosuresSetId: '',
				disclosuresSet: {
					id: '',
					name: '',
					disclosures: []
				},
				coveragesSetId: '',
				coveragesSet: {
					id: '',
					name: '',
					coverages: []
				}
			};
		};
	}}
>
	<div class="flex gap-2 p-8">
		<div class="flex flex-col w-full">
			<label for="selectedRatesheetId" class="label">Ratesheets</label>
			<select
				class="select"
				name="selectedRatesheetId"
				on:change={() => selectForm.submit()}
				bind:value={selectedRatesheet}
			>
				{#if ratesheets}
					<option value disabled>select ratesheet</option>
					{#each ratesheets as sheet}
						<option value={sheet.id} selected={sheet.id === ratesheet?.id}>
							{sheet.name}
						</option>
					{/each}
				{/if}
			</select>
		</div>
		<!-- <button class="btn variant-filled-primary dark:variant-ghost-primary w-[240px]"
			>Change Selection</button
		> -->
	</div>
</form>
{#if !ratesheet}
	<div class="flex px-8">
		<button
			type="button"
			class="btn variant-filled-primary dark:variant-ghost-primary"
			on:click={createEmptyRatesheet}>Create New Ratesheet</button
		>
	</div>
{/if}
<div class="flex flex-col gap-4 p-8">
	{#if ratesheet}
		<form class="flex flex-col gap-3" on:submit|preventDefault={handleSubmit} method="POST">
			<!-- action="?/saveRatesheet" -->
			<!-- use:enhance={() => {
				return async ({ update, result }) => {
					await update();
					if (result.status === 200) {
						toastStore.trigger({ message: '👍 Title updated successfully' });
						await invalidate('data:ratesheets');
					} else {
						toastStore.trigger({ message: 'Error updating title❗️' });
					}
				};
			}} -->
			<input type="hidden" name="ratesheetId" value={ratesheet.id} />
			<div
				class="flex gap-2 justify-between sticky top-0 bg-surface-50-900-token z-10 px-8 py-4 -mx-8 border-b border-surface-100-800-token"
			>
				<h2>{ratesheet.name}</h2>
				<div class="inline-flex gap-2">
					<button class="btn variant-filled-primary dark:variant-ghost-primary"> Save </button>
					<button
						type="button"
						on:click={deleteRatesheet}
						class="btn variant-filled-error dark:variant-ghost-error"
					>
						Delete
					</button>
				</div>
			</div>
			<div class="flex gap-4 items-end">
				<!-- <input type="hidden" name="id" value={ratesheet.id} /> -->
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
				<!-- <span class="inline-flex mb-2">
					<button class="btn-icon text-primary-500 dark:text-white w-6 h-6"
						><svelte:component this={SaveIcon} /></button
					>
				</span> -->
				<!-- <button class="btn btn-secondary w-24">Cancel</button> -->
			</div>

			<div class="flex flex-col gap-8">
				<Rates {ratesheet} />
				<Options {ratesheet} />
				<DisclosuresSets {ratesheet} {disclosuresSets} />
				<CoveragesSets {ratesheet} {coveragesSets} />
				<!-- <div class="flex flex-col gap-2">
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
				</div> -->
			</div>
		</form>
	{/if}
</div>
