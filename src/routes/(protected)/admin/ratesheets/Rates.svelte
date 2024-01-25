<script lang="ts">
	import { invalidate } from '$app/navigation';
	import type { RatesheetWithIncludes } from '$lib/types/types';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { getContext } from 'svelte';
	import DeleteIcon from '$lib/assets/icons/delete.svelte';
	import type { Row } from '@prisma/client';
	import type { Writable } from 'svelte/store';

	export let ratesheet: RatesheetWithIncludes | null = null;
	export let lowMileageCutoff: string = '600';

	const toastStore = getToastStore();
	const modalStore = getModalStore();

	const pendingStore = getContext<Writable<Boolean>>('pendingStore');

	const creatingRatesheetStore = getContext<Writable<Boolean>>('creatingRatesheetStore');
	const emptyRatesRowStore = getContext<Writable<Row | undefined>>('emptyRatesRowStore');

	const generateRandomUuid = () => {
		return crypto.randomUUID();
	};

	$: rateColHeaders = [
		'Term',
		'Units',
		'Mileage',
		`${new Date().getFullYear() - 4} &amp; newer <br /> 0-${lowMileageCutoff}k`,
		`${new Date().getFullYear() - 4} &amp; newer <br /> ${lowMileageCutoff}k+`,
		`${new Date().getFullYear() - 5} &amp; older <br /> 0-${lowMileageCutoff}k`,
		`${new Date().getFullYear() - 5} &amp; older <br /> ${lowMileageCutoff}k+`,
		'Deductible',
		'Aggregate',
		''
	];

	// svelte action to set the number of columns in the grid
	const headersCount = (node: HTMLDivElement) => {
		node.style.gridTemplateColumns = `repeat(${rateColHeaders.length}, 1fr)`;
	};

	$: addingNew = $emptyRatesRowStore ? true : false;

	const addNewRow = () => {
		emptyRatesRowStore.set({
			id: `new ${generateRandomUuid()}`,
			termValue: '',
			termUnit: 'months',
			mileageValue: '',
			costNewerLowMiles: '',
			costNewerHighMiles: '',
			costOlderLowMiles: '',
			costOlderHighMiles: '',
			deductible: '',
			aggregateLimit: '',
			ratesheetId: ratesheet?.id ?? ''
		});
	};

	const deleteRow = (id?: string, ratesheetId?: string) => {
		pendingStore.set(true);
		if (id === undefined) {
			emptyRatesRowStore.set(undefined);
			pendingStore.set(false);
			return;
		}
		new Promise<boolean>((resolve) => {
			modalStore.trigger({
				type: 'confirm',
				title: 'Confirm Delete',
				body: 'Are you sure you wish to delete this row (this is irreversible)?',

				response: (r: boolean) => {
					resolve(r);
				}
			});
		}).then(async (r) => {
			if (!r) {
				pendingStore.set(false);
				return;
			}

			await fetch(`/api/ratesheets/rows?id=${id}&ratesheetId=${ratesheetId}`, {
				method: 'DELETE'
			})
				.then(async (res) => {
					if (res.ok) {
						toastStore.trigger({ message: '👍 Row deleted successfully' });
						invalidate('form:ratesheet');
						ratesheet = (await res.json()) as RatesheetWithIncludes;
						pendingStore.set(false);
					}
				})
				.catch((err) => {
					toastStore.trigger({ message: `❗️ Error deleting row ${err}` });
					pendingStore.set(false);
				});
		});
	};
</script>

<div class="flex flex-col gap-2">
	<h2 class="h2">Rates</h2>
	<div class="grid gap-2 items-end" use:headersCount>
		{#if !$creatingRatesheetStore}
			{#each rateColHeaders as header}
				<div class="flex flex-col gap-1 font-semibold">
					{@html header}
				</div>
			{/each}
		{/if}
		{#if ratesheet?.rows}
			{#each ratesheet.rows.sort((a, b) => Number(a.termValue) - Number(b.termValue)) as row, k}
				<input type="hidden" name="rowId" value={row.id} style="display:none" />
				{#each Object.entries(row) as [key, value], i}
					{#if i !== 0}
						{#if key !== 'termUnit' && key !== 'ratesheetId' && typeof value === 'string'}
							<span class="inline-flex items-baseline gap-1">
								<input
									size={key === 'mileageValue' ? 3 : 10}
									class="input"
									class:w-auto={key === 'mileageValue'}
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
								<select class="input" name={`${key}`} {value}>
									<option value="days">days</option>
									<option value="months">months</option>
								</select>
							</span>
						{/if}
					{/if}
				{/each}
				<span class="inline-flex self-center ml-2 gap-2">
					<button
						type="button"
						on:click={() => deleteRow(row.id, row.ratesheetId)}
						class="btn-icon text-error-500 w-6 h-6"><svelte:component this={DeleteIcon} /></button
					>
				</span>
			{/each}
		{/if}
		{#if $emptyRatesRowStore}
			<input type="hidden" name="rowId" value={$emptyRatesRowStore?.id} style="display:none" />
			{#each Object.entries($emptyRatesRowStore) as [key, value], i}
				{#if key !== 'termUnit' && key !== 'ratesheetId' && key !== 'id' && typeof value === 'string'}
					<span class="inline-flex items-baseline gap-1">
						<input
							size={key === 'mileageValue' ? 3 : 10}
							class="input"
							class:w-auto={key === 'mileageValue'}
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
						<select class="input" name={`${key}`} {value}>
							<option value="days">days</option>
							<option value="months">months</option>
						</select>
					</span>
				{/if}
			{/each}
			<span class="inline-flex self-center ml-2 gap-2">
				<button
					type="button"
					on:click={() => deleteRow(undefined)}
					class="btn-icon text-error-500 w-6 h-6"><svelte:component this={DeleteIcon} /></button
				>
			</span>
		{/if}
	</div>
	<div>
		{#if $creatingRatesheetStore}
			Save Ratesheet First
		{:else if addingNew}
			<button class="btn bg-gradient-to-br variant-gradient-primary-secondary">Save Rates</button>
		{:else}
			<button
				type="button"
				class="btn bg-gradient-to-br variant-gradient-primary-secondary"
				on:click={addNewRow}><span class="text-2xl leading-none mr-2">+</span> Add Rate</button
			>
		{/if}
	</div>
</div>
