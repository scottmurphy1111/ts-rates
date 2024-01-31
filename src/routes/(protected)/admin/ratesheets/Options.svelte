<script lang="ts">
	import type { RatesheetWithIncludes } from '$lib/types/types';
	import DeleteIcon from '$lib/assets/icons/delete.svelte';
	import { getContext } from 'svelte';
	import { invalidate } from '$app/navigation';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import type { Option } from '@prisma/client';
	import { writable, type Writable } from 'svelte/store';

	export let ratesheet: RatesheetWithIncludes | null = null;

	const toastStore = getToastStore();
	const modalStore = getModalStore();

	const pendingStore = getContext<Writable<Boolean>>('pendingStore');

	const creatingRatesheetStore = getContext<Writable<Boolean>>('creatingRatesheetStore');
	const emptyOptionsRowStore = getContext<Writable<Option | undefined>>('emptyOptionsRowStore');

	const generateRandomUuid = () => {
		return crypto.randomUUID();
	};

	const optionColHeaders = ['Package', 'Term', 'Units', 'Cost', 'Refrigeration Hours', ''];
	const optionPackages = ['Trans&Diff', 'HVAC', 'APU', 'Refrigeration'];

	const headersCount = (node: HTMLDivElement) => {
		node.style.gridTemplateColumns = `repeat(${optionColHeaders.length}, 1fr)`;
	};

	$: addingNew = $emptyOptionsRowStore ? true : false;

	const addNewOption = () => {
		emptyOptionsRowStore.set({
			id: `new ${generateRandomUuid()}`,
			ratesheetId: ratesheet?.id as string,
			packageName: '',
			termValue: '',
			termUnit: 'months',
			cost: '',
			refrigerationHours: ''
		});
	};

	const emptyPackage = writable('');

	const deleteRow = (id?: string, ratesheetId?: string) => {
		pendingStore.set(true);
		if (id === undefined) {
			emptyOptionsRowStore.set(undefined);
			pendingStore.set(false);
			return;
		}
		new Promise<boolean>((resolve) => {
			modalStore.trigger({
				type: 'confirm',
				title: 'Confirm Action',
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

			await fetch(`/api/ratesheets/options?id=${id}&ratesheetId=${ratesheetId}`, {
				method: 'DELETE'
			})
				.then(async (res) => {
					if (res.ok) {
						toastStore.trigger({ message: '👍 Option deleted successfully' });
						invalidate('form:ratesheet');
						ratesheet = (await res.json()) as RatesheetWithIncludes;
						pendingStore.set(false);
					}
				})
				.catch((err) => {
					toastStore.trigger({ message: `❗️ Error deleting option ${err}` });
					pendingStore.set(false);
				});
		});
	};
</script>

<div class="flex flex-col gap-2">
	<h2 class="h2">Options</h2>
	<div class="grid gap-2 items-end" use:headersCount>
		{#if !$creatingRatesheetStore}
			{#each optionColHeaders as header}
				<div class="flex flex-col gap-1 font-semibold">
					{header}
				</div>
			{/each}
		{/if}
		{#if ratesheet?.options}
			{#each ratesheet?.options.sort( (a, b) => (a.packageName > b.packageName ? 1 : a.packageName < b.packageName ? -1 : 0 || Number(a.termValue) - Number(b.termValue)) ) as option, i}
				<input hidden name="optionId" value={option.id} />
				<select class="select" name={`optionPackageName`} value={option.packageName}>
					{#each optionPackages as oPackage}
						<option value={oPackage}>{oPackage}</option>
					{/each}
				</select>
				<input type="text" class="input" name={`optionTermValue`} value={option.termValue} />
				<select class="input" name={`optionTermUnit`} value={option.termUnit}>
					<option value="days">days</option>
					<option value="months">months</option>
				</select>
				<input type="text" class="input" name={`optionCost`} value={option.cost} />
				{#if option.packageName === 'Refrigeration'}
					<input
						type="text"
						class="input"
						name={`optionRefrigerationHours`}
						value={option.refrigerationHours}
					/>
				{:else}
					<input
						class="input disabled"
						type="text"
						name={`optionRefrigerationHours`}
						value={null}
					/>
				{/if}
				<span class="inline-flex self-center ml-2 gap-2">
					<button
						type="button"
						on:click={() => deleteRow(option.id, ratesheet?.id)}
						class="btn-icon text-error-500 w-6 h-6"><svelte:component this={DeleteIcon} /></button
					>
				</span>
			{/each}
		{/if}
		{#if $emptyOptionsRowStore}
			<input hidden name="optionId" value={$emptyOptionsRowStore.id} />
			<select
				class="select"
				name={`optionPackageName`}
				value={$emptyOptionsRowStore.packageName}
				on:change={(val) => emptyPackage.set(val.currentTarget?.value)}
			>
				{#each optionPackages as oPackage}
					<option value={oPackage}>{oPackage}</option>
				{/each}
			</select>
			<input
				type="text"
				class="input"
				name={`optionTermValue`}
				value={$emptyOptionsRowStore.termValue}
			/>
			<select class="input" name={`optionTermUnit`} value={$emptyOptionsRowStore.termUnit}>
				<option value="days">days</option>
				<option value="months">months</option>
			</select>
			<input type="text" class="input" name={`optionCost`} value={$emptyOptionsRowStore.cost} />
			{#if $emptyPackage === 'Refrigeration'}
				<input
					type="text"
					class="input"
					name={`optionRefrigerationHours`}
					value={$emptyOptionsRowStore.refrigerationHours}
				/>
			{:else}
				<input class="input disabled" type="text" name={`optionRefrigerationHours`} value={null} />
			{/if}
			<span class="inline-flex self-center ml-2 gap-2">
				<button type="button" on:click={() => deleteRow()} class="btn-icon text-error-500 w-6 h-6"
					><svelte:component this={DeleteIcon} /></button
				>
			</span>
		{/if}
	</div>
	<div>
		{#if $creatingRatesheetStore}
			Save Ratesheet First
		{:else if addingNew}
			<button class="btn bg-gradient-to-br variant-gradient-primary-secondary">Save Options</button>
		{:else}
			<button
				type="button"
				class="btn bg-gradient-to-br variant-gradient-primary-secondary"
				on:click={addNewOption}><span class="text-2xl leading-none mr-2">+</span> Add Option</button
			>
		{/if}
	</div>
</div>

<style>
	.disabled {
		background-color: #f5f5f5;
		color: #a0aec0;
		cursor: not-allowed;
		opacity: 0.5;
		pointer-events: none;
	}
</style>
