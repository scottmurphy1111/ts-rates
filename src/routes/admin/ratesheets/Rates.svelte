<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import type { RatesheetsWithIncludes } from '$lib/types/types';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import SaveIcon from '$lib/assets/icons/save.svelte';
	import DeleteIcon from '$lib/assets/icons/delete.svelte';

	export let ratesheet: RatesheetsWithIncludes | null = null;

	const toastStore = getToastStore();
	const modalStore = getModalStore();

	// export let numCols = 0;

	onMount(() => {
		// console.log('mounted');
		// numCols = rateColHeaders.length;
		// console.log('numCols', numCols);
	});

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
		'Actions'
	];

	// svelte action to set the number of columns in the grid
	const headersCount = (node: HTMLDivElement) => {
		node.style.gridTemplateColumns = `repeat(${rateColHeaders.length}, 1fr)`;
	};

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

	const deleteRow = (id?: string, ratesheetId?: string) => {
		console.log('deleteRow', id);
		if (id === undefined) {
			emptyRatesRow = undefined;
			return;
		}
		new Promise<boolean>((resolve) => {
			modalStore.trigger({
				type: 'confirm',
				// Data
				title: 'Confirm Delete',
				body: 'Are you sure you wish to delete this row (this is irreversible)?',
				// TRUE if confirm pressed, FALSE if cancel pressed
				response: (r: boolean) => {
					resolve(r);
				}
			});
		}).then(async (r) => {
			console.log('response', r);
			if (!r) return;

			await fetch(`/api/ratesheets/rows/?id=${id}&ratesheetId=${ratesheetId}`, {
				method: 'DELETE'
			})
				.then(async (res) => {
					if (res.ok) {
						toastStore.trigger({ message: 'Row deleted successfully' });
						invalidate('form:ratesheet');
						ratesheet = (await res.json()) as RatesheetsWithIncludes;
					}
				})
				.catch((err) => {
					toastStore.trigger({ message: `Error deleting row ${err}` });
				});
			// await invalidate('data:ratesheets');
		});
	};
</script>

<div class="flex flex-col gap-2">
	<h2 class="h2">Rates</h2>
	<div class="grid gap-2 items-end" use:headersCount>
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
					use:enhance={() => {
						return async ({ update, result }) => {
							await update();
							if (result.status === 200) {
								toastStore.trigger({ message: '👍 Row updated successfully' });
							} else {
								toastStore.trigger({ message: 'Error updating row❗️' });
							}
						};
					}}
				>
					{#each Object.entries(row) as [key, value], i}
						<input type="hidden" name="id" value={row.id} style="display:none" />

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
						<button class="btn-icon text-primary-500 dark:text-white w-6 h-6"
							><svelte:component this={SaveIcon} /></button
						>
						<button
							type="button"
							on:click={() => deleteRow(row.id, row.ratesheetId)}
							class="btn-icon text-error-500 w-6 h-6"><svelte:component this={DeleteIcon} /></button
						>
					</span>
				</form>
			{/each}
		{/if}
		{#if emptyRatesRow}
			<form
				method="post"
				action={`?/createRow`}
				style="display:contents"
				use:enhance={() => {
					return async ({ update, result }) => {
						await update();
						await invalidate('data:ratesheets');
						if (result.status === 200) {
							toastStore.trigger({ message: '👍 Rate created successfully' });
							emptyRatesRow = undefined;
						} else {
							toastStore.trigger({ message: 'Error creating rate❗️' });
						}
						// selectedRatesheet = ratesheet?.name ?? '';
					};
				}}
			>
				<input type="hidden" name="ratesheetId" value={ratesheet?.id} style="display:none" />

				{#each Object.entries(emptyRatesRow) as [key, value], i}
					<!-- <input type="hidden" name="id" value={emptyRatesRow.id} style="display:none" /> -->

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
				{/each}
				<span class="inline-flex self-center ml-2 gap-2">
					<button class="btn-icon text-primary-500 dark:text-white w-6 h-6"
						><svelte:component this={SaveIcon} /></button
					>
					<button
						type="button"
						on:click={() => deleteRow(undefined)}
						class="btn-icon text-error-500 w-6 h-6"><svelte:component this={DeleteIcon} /></button
					>
				</span>
			</form>
		{/if}
	</div>
	<div>
		<button class="btn variant-filled-primary dark:variant-ghost-primary" on:click={addNewRow}
			><span class="text-2xl leading-none mr-2">+</span> Add Rate</button
		>
	</div>
</div>
