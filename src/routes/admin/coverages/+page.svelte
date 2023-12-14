<script lang="ts">
	import { enhance } from '$app/forms';
	import UpIcon from '$lib/assets/icons/up.svelte';
	import type { PageData, ActionData } from './$types';
	import DeleteIcon from '$lib/assets/icons/delete.svelte';
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import { invalidate } from '$app/navigation';
	import { flip } from 'svelte/animate';
	import { onMount } from 'svelte';
	import type { CoveragesSetWithIncludes } from '$lib/types/types';

	export let data: PageData;
	export let form: ActionData;

	let selectForm: HTMLFormElement;

	const toastStore = getToastStore();
	const modalStore = getModalStore();

	$: ({ coveragesSets } = data);
	$: coveragesSet = (form?.coveragesSet as CoveragesSetWithIncludes) ?? null;

	$: selectedCoverageSet = coveragesSet?.id ?? '';

	let orderedCoverages: any[] = [];

	const generateRandomUuid = () => {
		return crypto.randomUUID();
	};

	onMount(() => {
		orderedCoverages =
			coveragesSet?.coverages.sort((a, b) => Number(a.order) - Number(b.order)) ?? [];
	});

	const moveUp = (order: string) => {
		const selectedCoverage = orderedCoverages?.find((d) => d.order === order);

		if (selectedCoverage?.order === '0') return;
		orderedCoverages = orderedCoverages
			.map((d) => {
				if (d.order === order) {
					d.order = String(Number(d.order) - 1);
				}
				if (d.order === String(Number(selectedCoverage?.order) - 1)) {
					d.order = String(Number(d.order) + 1);
				}
				return d;
			})
			.sort((a, b) => Number(a.order) - Number(b.order));
	};

	const moveDown = (order: string) => {
		let selectedCoverage = orderedCoverages?.find((d) => d.order === order);
		let nextCoverage = orderedCoverages?.find(
			(d) => d.order === String(Number(selectedCoverage?.order) + 1)
		);

		const leftArr = orderedCoverages.slice(0, Number(selectedCoverage?.order));
		const rightArr = orderedCoverages.slice(
			Number(selectedCoverage?.order) + 2,
			orderedCoverages.length
		);
		if (!nextCoverage) return;
		if (!selectedCoverage) return;
		nextCoverage = {
			...nextCoverage,
			order: String(Number(nextCoverage?.order) - 1)
		};
		selectedCoverage = {
			...selectedCoverage,
			order: String(Number(selectedCoverage?.order) + 1)
		};

		orderedCoverages = [...leftArr, nextCoverage, selectedCoverage, ...rightArr];
		orderedCoverages = orderedCoverages.sort((a, b) => Number(a.order) - Number(b.order));
	};

	const addNewCoverage = () => {
		const newCoverage: any = {
			id: `new ${generateRandomUuid()}`,
			title: '',
			description: '',
			order: String(orderedCoverages.length)
		};
		orderedCoverages = [...orderedCoverages, newCoverage];
	};

	const deleteCoverage = (id: string, coveragesSetId: string) => {
		if (id === undefined) {
			return;
		}
		new Promise<boolean>((resolve) => {
			modalStore.trigger({
				type: 'confirm',
				// Data
				title: 'Confirm Delete',
				body: 'Are you sure you wish to delete this coverage (this is irreversible)?',
				// TRUE if confirm pressed, FALSE if cancel pressed
				response: (r: boolean) => {
					resolve(r);
				}
			});
		}).then(async (r) => {
			if (!r) return;

			await fetch(`/api/coverages?id=${id}&coveragesSetId=${coveragesSetId}`, {
				method: 'DELETE'
			})
				.then(async (res) => {
					if (res.ok) {
						invalidate('form:coveragesSet');
						coveragesSet = (await res.json()) as CoveragesSetWithIncludes;
						orderedCoverages =
							coveragesSet?.coverages.sort((a, b) => Number(a.order) - Number(b.order)) ?? [];
						toastStore.trigger({ message: '👍 Coverage deleted successfully' });
					}
				})
				.catch((err) => {
					toastStore.trigger({ message: `❗️ Error deleting coverage ${err}` });
				});
		});
	};

	let emptyCoveragesSet = {
		id: `new ${generateRandomUuid()}`,
		name: '',
		coverages: []
	};
	const createEmptyCoveragesSet = () => {
		orderedCoverages = [];
		coveragesSet = emptyCoveragesSet;
	};

	const handleSubmit = async (e: Event) => {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);

		await fetch('/api/coverages', {
			method: 'POST',
			body: formData
		})
			.then(async (res) => {
				if (res.ok) {
					coveragesSet = (await res.json()) as CoveragesSetWithIncludes;
					orderedCoverages =
						coveragesSet?.coverages.sort((a, b) => Number(a.order) - Number(b.order)) ?? [];
					invalidate('data:coveragesSets');
					toastStore.trigger({ message: '👍 Coverage Set updated successfully' });
				}
			})
			.catch((err) => {
				toastStore.trigger({ message: `❗️ Error updating Coverages Set ${err}` });
			});
	};
</script>

<form
	method="POST"
	action="?/selectCoveragesSet"
	bind:this={selectForm}
	use:enhance={() => {
		return async ({ update }) => {
			await update();
			emptyCoveragesSet = {
				id: `new ${generateRandomUuid()}`,
				name: '',
				coverages: []
			};
		};
	}}
>
	<div class="flex gap-2 p-8">
		<div class="flex flex-col w-full">
			<label for="selectedCoveragesSetId" class="label">Coverage Sets</label>
			<select
				class="select"
				name="selectedCoveragesSetId"
				on:change={() => selectForm.submit()}
				bind:value={selectedCoverageSet}
			>
				{#if coveragesSets}
					<option value disabled>Make a selection</option>
					{#each coveragesSets as set}
						<option value={set.id} selected={set.id === coveragesSet?.id}>
							{set.name}
						</option>
					{/each}
				{/if}
			</select>
		</div>
	</div>
</form>
{#if !coveragesSet}
	<div class="flex px-8">
		<button
			type="button"
			class="btn variant-filled-primary dark:variant-ghost-primary"
			on:click={createEmptyCoveragesSet}>Create New Coverages Set</button
		>
	</div>
{/if}
<div class="flex flex-col gap-4 p-8">
	{#if coveragesSet}
		<form class="flex flex-col gap-3" on:submit|preventDefault={handleSubmit} method="POST">
			<input type="hidden" name="coveragesSetId" value={coveragesSet.id} />
			<div
				class="flex gap-2 justify-between sticky top-0 bg-surface-50-900-token z-10 px-8 py-4 -mx-8 border-b border-surface-100-800-token"
			>
				<h2>{coveragesSet.name}</h2>
				<button type="submit" class="btn variant-filled-primary dark:variant-ghost-primary">
					Save
				</button>
			</div>
			<label for="title" class="label mb-8"
				>Name
				<input class="input" name="name" value={coveragesSet.name} />
			</label>

			{#if !coveragesSet?.coverages}
				...llooiadnign
			{:else}
				{#each orderedCoverages as coverage (coverage.id)}
					<div
						class="card !bg-surface-100-800-token p-4 flex items-start gap-2"
						animate:flip={{ duration: 200 }}
					>
						<div class="flex flex-col gap-2 w-full">
							<input type="hidden" name={`coverageId`} value={coverage.id} />
							<input type="hidden" name={`coverageOrder`} value={coverage.order} />
							<label for="coverageTitle" class="label">
								Title
								<input
									type="text"
									class="input p-2"
									name={`coverageTitle`}
									bind:value={coverage.title}
								/>
							</label>
							<label for="coverageDescription" class="label">
								Description

								<textarea
									class="textarea"
									name={`coverageDescription`}
									bind:value={coverage.description}
								/>
							</label>
						</div>
						<div class="flex flex-col gap-2 ml-4">
							<button
								type="button"
								class="btn btn-icon variant-filled w-6 h-6"
								disabled={coverage.order === '0'}
								on:click={() => moveUp(coverage.order)}
							>
								<svelte:component this={UpIcon} />
							</button>
							<button
								type="button"
								class="btn btn-icon variant-filled w-6 h-6 rotate-180 mb-8"
								disabled={Number(coverage.order) === orderedCoverages.length - 1}
								on:click={() => moveDown(coverage.order)}
							>
								<svelte:component this={UpIcon} />
							</button>
							<button
								type="button"
								on:click={() => deleteCoverage(coverage.id, coveragesSet.id)}
								class="btn-icon text-error-500 w-6 h-6"
								><svelte:component this={DeleteIcon} /></button
							>
						</div>
					</div>
				{/each}
			{/if}
		</form>
		<div>
			<button
				class="btn variant-filled-primary dark:variant-ghost-primary"
				on:click={addNewCoverage}
				><span class="text-2xl leading-none mr-2">+</span> Add Coverage</button
			>
		</div>
	{/if}
</div>
