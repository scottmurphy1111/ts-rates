<script lang="ts">
	import { enhance } from '$app/forms';
	import { writable } from 'svelte/store';
	import type { PageData, ActionData } from './$types';
	import type { DisclosuresSetWithIncludes } from '$lib/types/types';

	export let data: PageData;
	export let form: ActionData;

	$: ({ disclosuresSets } = data);
	$: disclosuresSet = (form?.disclosuresSet as DisclosuresSetWithIncludes) ?? null;

	$: orderedDisclosures = disclosuresSet?.disclosures ?? [];

	const moveUp = (order: string) => {
		const selectedDisclosure = orderedDisclosures?.find((d) => d.order === order);

		if (selectedDisclosure?.order === '0') return;
		orderedDisclosures = orderedDisclosures
			.map((d) => {
				if (d.order === order) {
					d.order = String(Number(d.order) - 1);
				}
				if (d.order === String(Number(selectedDisclosure?.order) - 1)) {
					d.order = String(Number(d.order) + 1);
				}
				return d;
			})
			.sort((a, b) => Number(a.order) - Number(b.order));
	};

	const moveDown = (order: string) => {
		let selectedDisclosure = orderedDisclosures?.find((d) => d.order === order);
		let nextDisclosure = orderedDisclosures?.find(
			(d) => d.order === String(Number(selectedDisclosure?.order) + 1)
		);

		const leftArr = orderedDisclosures.slice(0, Number(selectedDisclosure?.order));
		const rightArr = orderedDisclosures.slice(
			Number(selectedDisclosure?.order) + 2,
			orderedDisclosures.length
		);
		if (!nextDisclosure) return;
		if (!selectedDisclosure) return;
		nextDisclosure = {
			...nextDisclosure,
			order: String(Number(nextDisclosure?.order) - 1)
		};
		selectedDisclosure = {
			...selectedDisclosure,
			order: String(Number(selectedDisclosure?.order) + 1)
		};

		orderedDisclosures = [...leftArr, nextDisclosure, selectedDisclosure, ...rightArr];
		orderedDisclosures = orderedDisclosures.sort((a, b) => Number(a.order) - Number(b.order));
	};
</script>

<form method="POST" action="?/selectDisclosuresSet" use:enhance>
	<div class="flex gap-2 p-8">
		<select
			class="select"
			name="selectedDisclosuresSet"
			value={disclosuresSet?.id ? disclosuresSet?.id : disclosuresSets?.[0]?.id}
		>
			{#if disclosuresSets}
				<option disabled hidden value>select ratesheet</option>
				{#each disclosuresSets as set}
					<option value={set.id} selected={set.id === disclosuresSet?.id}>
						{set.title}
					</option>
				{/each}
			{/if}
		</select>
		<button class="btn variant-filled-primary dark:variant-ghost-primary w-[240px]"
			>Change Selection</button
		>
	</div>
</form>

{#if disclosuresSet}
	<div class="flex flex-col gap-4 p-8">
		<div class="flex">
			<h2>{disclosuresSet.title}</h2>
			<button class="btn variant-filled-primary dark:variant-ghost-primary w-[240px]">
				Save
			</button>
		</div>
		{#each orderedDisclosures as disclosure}
			<div class="flex items-center">
				<div class="flex flex-col gap-2">
					<button
						type="button"
						class="btn variant-filled"
						disabled={disclosure.order === '0'}
						on:click={() => moveUp(disclosure.order)}>up</button
					>
					<button
						type="button"
						class="btn variant-filled"
						disabled={Number(disclosure.order) === orderedDisclosures.length - 1}
						on:click={() => moveDown(disclosure.order)}>down</button
					>
				</div>

				<div class="flex flex-col gap-2 w-full">
					<input type="text" class="input p-2" name={`disclosureTitle`} value={disclosure.title} />
					<textarea
						class="textarea"
						name={`disclosureDescription`}
						value={disclosure.description}
					/>
				</div>
			</div>
		{/each}
	</div>
{/if}
