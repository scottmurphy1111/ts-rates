<script lang="ts">
	import type { PageData } from './$types';
	import { writable, type Writable } from 'svelte/store';
	import { invalidate } from '$app/navigation';
	import { getContext, setContext } from 'svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { RatesheetWithIncludes } from '$lib/types/types';
	import Rates from './Rates.svelte';
	import Options from './Options.svelte';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import DisclosuresSets from './DisclosuresSets.svelte';
	import CoveragesSets from './CoveragesSets.svelte';
	import type { Row, Option } from '@prisma/client';
	import { format } from 'date-fns';

	export let data: PageData;
	$: ({ ratesheets, disclosuresSets, coveragesSets } = data);

	const toastStore = getToastStore();
	const modalStore = getModalStore();

	const pendingStore = getContext<Writable<Boolean>>('pendingStore');

	const creatingRatesheetStore = writable<boolean>(false);
	const emptyRatesRowStore = writable<Row | undefined>(undefined);
	const emptyOptionsRowStore = writable<Option | undefined>(undefined);

	setContext('creatingRatesheetStore', creatingRatesheetStore);
	setContext('emptyRatesRowStore', emptyRatesRowStore);
	setContext('emptyOptionsRowStore', emptyOptionsRowStore);

	let ratesheet: RatesheetWithIncludes | null = null;

	$: selectedRatesheetId = ratesheet?.id ?? '';

	$: lowMileageCutoff = ratesheet?.lowMileageCutoff ?? '600';

	$: isVocational = ratesheet?.isVocational ?? false;

	let emptyRatesheet: RatesheetWithIncludes = {
		id: 'new',
		createdAt: new Date(),
		updatedAt: new Date(),
		name: '',
		title: '',
		subtitle: '',
		lowMileageCutoff: '',
		isVocational: false,
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

	const handleSelect = async (e: Event) => {
		const ratesheetId = (e.target as HTMLSelectElement)?.value;
		e.preventDefault();

		pendingStore.set(true);
		creatingRatesheetStore.set(false);

		await fetch(`/api/ratesheets?id=${ratesheetId}`)
			.then(async (res) => {
				if (res.ok) {
					ratesheet = (await res.json()) as RatesheetWithIncludes;
					resetEmptyRows();
					pendingStore.set(false);
				}
			})
			.catch((err) => {
				toastStore.trigger({ message: `❗️ Error fetching ratesheet ${err}` });
				pendingStore.set(false);
			});
	};

	const handleSave = async (e: Event) => {
		e.preventDefault();

		pendingStore.set(true);
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
					pendingStore.set(false);
					creatingRatesheetStore.set(false);
				}
			})
			.catch((err) => {
				toastStore.trigger({ message: `❗️ Error updating Ratesheet ${err}` });
				pendingStore.set(false);
			});
	};

	const deleteRatesheet = () => {
		pendingStore.set(true);
		new Promise<boolean>((resolve) => {
			modalStore.trigger({
				type: 'confirm',
				title: 'Confirm Delete',
				body: 'Are you sure you wish to delete this ratesheet (this is irreversible)?',

				response: (r: boolean) => {
					resolve(r);
				}
			});
		}).then(async (r) => {
			if (!r) {
				pendingStore.set(false);
				return;
			}

			await fetch(`/api/ratesheets?id=${ratesheet?.id}`, {
				method: 'DELETE'
			})
				.then(async (res) => {
					if (res.ok) {
						toastStore.trigger({ message: '👍 Ratesheet deleted successfully' });
						invalidate('data:ratesheets');
						ratesheet = null;
						pendingStore.set(false);
					}
				})
				.catch((err) => {
					toastStore.trigger({ message: `❗️ Error deleting ratesheet ${err}` });
					pendingStore.set(false);
				});
		});
	};

	const clearRatesheet = () => {
		ratesheet = null;
	};

	const cloneRatesheet = async (e: Event) => {
		pendingStore.set(true);
		await fetch(`/api/ratesheets/clone?ratesheetId=${ratesheet?.id}`, {
			method: 'POST'
		})
			.then(async (res) => {
				if (res.ok) {
					toastStore.trigger({ message: '👍 Ratesheet cloned successfully' });
					ratesheet = (await res.json()) as RatesheetWithIncludes;
					invalidate('data:ratesheets');
					pendingStore.set(false);
				}
			})
			.catch((err) => {
				toastStore.trigger({ message: `❗️ Error cloning ratesheet ${err}` });
				pendingStore.set(false);
			});
	};
</script>

{#if !ratesheet}
	<div class="flex px-8 pt-8 mb-4">
		<button
			type="button"
			class="btn bg-gradient-to-br variant-gradient-primary-secondary"
			on:click={createEmptyRatesheet}>Create New Ratesheet</button
		>
	</div>
	<div class="flex gap-2 px-8 mb-4">
		<span>- OR -</span>
	</div>
	<div class="flex gap-2 px-8">
		<div class="flex flex-col w-full gap-2">
			<select
				class="select"
				name="selectedRatesheetId"
				on:change={handleSelect}
				bind:value={selectedRatesheetId}
			>
				{#if ratesheets}
					<option value disabled>Select an Existing Ratesheet</option>
					{#each ratesheets.sort( (a, b) => (b.name > a.name ? 1 : b.name < a.name ? -1 : 0) ) as sheet}
						<option value={sheet.id}>
							{sheet.name}
						</option>
					{/each}
				{/if}
			</select>
		</div>
	</div>
{/if}

<div class="flex flex-col gap-4 px-8">
	{#if ratesheet}
		<form class="flex flex-col gap-24" on:submit|preventDefault={handleSave} method="POST">
			<input type="hidden" name="ratesheetId" value={ratesheet.id} />
			<div
				class="flex flex-col gap-2 justify-between sticky top-0 bg-surface-50-900-token z-10 px-8 py-4 -mx-8 border-b border-surface-100-800-token"
			>
				<div class="flex gap-2 justify-between w-full">
					<h2 class="h2 break-all">{ratesheet.name}</h2>
					<div class="flex flex-col text-xs">
						<span>Created {format(ratesheet.createdAt, 'MM/dd/yyyy - hh:mm:ss a')}</span>
						<span>Last Updated {format(ratesheet.updatedAt, 'MM/dd/yyyy - hh:mm:ss a')}</span>
					</div>
				</div>
				<div class="inline-flex gap-4 justify-between">
					{#if ratesheet.id !== 'new'}
						<div class="flex gap-2">
							<button
								type="button"
								on:click={deleteRatesheet}
								class="btn bg-gradient-to-br from-error-600 to-error-700 text-white dark:from-error-600 dark:to-error-700"
							>
								Delete
							</button>
							<button
								disabled={!ratesheet?.disclosuresSetId || !ratesheet?.coveragesSetId}
								class="btn bg-gradient-to-br from-success-600 to-success-700 text-white dark:from-success-600 dark:to-success-700"
								type="button"
								on:click={cloneRatesheet}
							>
								Clone
							</button>
						</div>
					{/if}
					<div class="inline-flex gap-2">
						<button class="btn bg-gradient-to-br variant-gradient-primary-secondary">Save</button>
						<button
							type="button"
							on:click={clearRatesheet}
							class="btn bg-gradient-to-br variant-filled-tertiary"
						>
							Cancel
						</button>
					</div>
				</div>
			</div>
			<div class="flex flex-col gap-4">
				<div class="flex gap-4 items-end">
					<label for="title" class="label"
						>Title
						<input class="input" type="text" name="title" value={ratesheet.title} />
					</label>
					<label for="subtitle" class="label w-full"
						>Subtitle
						<input class="input" type="text" name="subtitle" value={ratesheet.subtitle} />
					</label>
					<label for="lowMileageCutoff" class="label flex flex-col"
						>Low Mileage Cutoff
						<span class="inline-flex items-baseline gap-1">
							<input
								class="input"
								type="text"
								name="lowMileageCutoff"
								bind:value={ratesheet.lowMileageCutoff}
								size="3"
							/>
							<span>000</span>
						</span>
					</label>
				</div>
				<div class="mb-16">
					<label for="isVocational" class="label flex gap-4 items-center">
						<input
							type="checkbox"
							class="checkbox"
							bind:checked={ratesheet.isVocational}
							name="isVocational"
							value={ratesheet.isVocational}
						/>
						Is Vocational and / or Appartus?
					</label>
				</div>

				<div class="flex flex-col gap-24">
					<Rates {ratesheet} {lowMileageCutoff} {isVocational} />
					<Options {ratesheet} />
					<DisclosuresSets {ratesheet} {disclosuresSets} />
					<CoveragesSets {ratesheet} {coveragesSets} />
				</div>
				<div
					class="flex gap-2 justify-end sticky top-0 bg-surface-50-900-token z-10 px-8 py-4 -mx-8 border-surface-100-800-token"
				>
					<div class="inline-flex gap-2">
						<button class="btn bg-gradient-to-br variant-gradient-primary-secondary">Save</button>
						<button
							type="button"
							on:click={clearRatesheet}
							class="btn bg-gradient-to-br variant-filled-tertiary"
						>
							Cancel
						</button>
					</div>
				</div>
			</div>
		</form>
	{/if}
</div>
