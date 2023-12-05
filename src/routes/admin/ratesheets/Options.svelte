<script lang="ts">
	import type { OptionWithIncludes, RatesheetsWithIncludes } from '$lib/types/types';
	import type { Option, OptionPackage } from '@prisma/client';
	import SaveIcon from '$lib/assets/icons/save.svelte';
	import DeleteIcon from '$lib/assets/icons/delete.svelte';
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { getToastStore } from '@skeletonlabs/skeleton';

	export let ratesheet: RatesheetsWithIncludes | null = null;

	const toastStore = getToastStore();
	const modalStore = getModalStore();

	// $: numCols = 0;
	// onMount(() => {
	// 	// numCols = optionColHeaders.length;

	// 	fetch(`/api/option-packages`)
	// 		.then((res) => res.json())
	// 		.then((data) => {
	// 			optionPackages = data as OptionPackage[];
	// 		});
	// });

	const optionColHeaders = ['Package', 'Term', 'Units', 'Cost', 'Actions'];
	const optionPackages = ['Trans&Diff', 'HVAC', 'APU', 'Refrigeration'];

	const headersCount = (node: HTMLDivElement) => {
		node.style.gridTemplateColumns = `repeat(${optionColHeaders.length}, 1fr)`;
	};
	// let optionPackages = [] as OptionPackage[];

	let emptyOptionsRow:
		| {
				package: any;
				// termValue?: any;
				// termUnit?: any;
				// cost?: any;
				details?: { termValue: string; termUnit: string; cost: string };
		  }
		| undefined = undefined;
	const addNewOption = () => {
		emptyOptionsRow = {
			package: {
				name: ''
			},
			details: {
				termValue: '',
				termUnit: 'months',
				cost: ''
			}
		};
	};

	const deleteRow = (id?: string, ratesheetId?: string) => {
		console.log('deleteoption', id);
		if (id === undefined) {
			emptyOptionsRow = undefined;
			return;
		}
		new Promise<boolean>((resolve) => {
			modalStore.trigger({
				type: 'confirm',
				// Data
				title: 'Confirm Action',
				body: 'Are you sure you wish to delete this row (this is irreversible)?',
				// TRUE if confirm pressed, FALSE if cancel pressed
				response: (r: boolean) => {
					resolve(r);
				}
			});
		}).then(async (r) => {
			console.log('response', r);
			if (!r) return;

			await fetch(`/api/ratesheets/options/?id=${id}&ratesheetId=${ratesheetId}`, {
				method: 'DELETE'
			}).then(async (res) => {
				if (res.ok) {
					console.log('res.ok', res.ok);
					invalidate('form:ratesheet');
					ratesheet = (await res.json()) as RatesheetsWithIncludes;
				}
			});
			// await invalidate('data:ratesheets');
		});
	};
</script>

<div class="flex flex-col gap-2">
	<h2 class="h2">Options</h2>
	<div class="grid gap-2 items-end" use:headersCount>
		{#each optionColHeaders as header}
			<div class="flex flex-col gap-1 font-semibold">
				{header}
			</div>
		{/each}
		{#if ratesheet?.options}
			{#each ratesheet.options as option, i}
				<form
					method="post"
					action={`?/updateOption=${option.id}`}
					style="display:contents"
					use:enhance={() => {
						return async ({ update, result }) => {
							await update();
							if (result.status === 200) {
								toastStore.trigger({ message: '👍 Option updated successfully' });
							} else {
								toastStore.trigger({ message: 'Error updating option❗️' });
							}
						};
					}}
				>
					<input type="hidden" name="id" value={option.id} style="display:none" />
					<select class="select" name={`optionPackage`} value={option.package?.name}>
						{#each optionPackages as oPackage}
							<option value={oPackage}>{oPackage}</option>
						{/each}
						<!-- <option value="Trans&Diff">Trans&Diff</option>
						<option value="HVAC">HVAC</option>
						<option value="APU">APU</option>
						<option value="Refrigeration">Refrigeration</option> -->
					</select>
					<!-- {#each option.details as detail} -->
					<input
						type="text"
						class="input"
						name={`optionTermValue`}
						value={option.details.termValue}
					/>
					<select class="input" name={`optionTermUnit`} value={option.details.termUnit}>
						<option value="days">days</option>
						<option value="months">months</option>
					</select>
					<input type="text" class="input" name={`optionCost`} value={option.details.cost} />
					<!-- {/each} -->
					<span class="inline-flex self-center ml-2 gap-2">
						<button class="btn-icon text-primary-500 dark:text-white w-6 h-6"
							><svelte:component this={SaveIcon} /></button
						>
						<button
							type="button"
							on:click={() => deleteRow(option.id, ratesheet?.id)}
							class="btn-icon text-error-500 w-6 h-6"><svelte:component this={DeleteIcon} /></button
						>
					</span>
				</form>
			{/each}
		{/if}
		{#if emptyOptionsRow}
			<form
				method="post"
				action={`?/createOption`}
				style="display:contents"
				use:enhance={() => {
					return async ({ update, result }) => {
						await update();
						await invalidate('form:ratesheet');
						if (result.status === 200) {
							toastStore.trigger({ message: '👍 Option created successfully' });
							emptyOptionsRow = undefined;
						} else {
							toastStore.trigger({ message: 'Error creating option❗️' });
						}
					};
				}}
			>
				<input type="hidden" name="ratesheetId" value={ratesheet?.id} style="display:none" />
				<select class="select" name={`optionPackage`} value={emptyOptionsRow.package?.name}>
					{#each optionPackages as oPackage}
						<option value={oPackage}>{oPackage}</option>
					{/each}
					<!-- <option value="Trans&Diff">Trans&Diff</option>
					<option value="HVAC">HVAC</option>
					<option value="APU">APU</option>
					<option value="Refrigeration">Refrigeration</option> -->
				</select>
				<input
					type="text"
					class="input"
					name={`optionTermValue`}
					value={emptyOptionsRow.details?.termValue}
				/>
				<select class="input" name={`optionTermUnit`} value={emptyOptionsRow.details?.termUnit}>
					<option value="days">days</option>
					<option value="months">months</option>
				</select>
				<input
					type="text"
					class="input"
					name={`optionCost`}
					value={emptyOptionsRow.details?.cost}
				/>
				<span class="inline-flex self-center ml-2 gap-2">
					<button class="btn-icon text-primary-500 dark:text-white w-6 h-6"
						><svelte:component this={SaveIcon} /></button
					>
					<button type="button" on:click={() => deleteRow()} class="btn-icon text-error-500 w-6 h-6"
						><svelte:component this={DeleteIcon} /></button
					>
				</span>
			</form>
		{/if}
	</div>
	<div>
		<button class="btn variant-filled-primary dark:variant-ghost-primary" on:click={addNewOption}
			><span class="text-2xl leading-none mr-2">+</span> Add Option</button
		>
	</div>
</div>
