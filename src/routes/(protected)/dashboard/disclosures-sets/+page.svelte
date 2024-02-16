<script lang="ts">
	import UpIcon from '$lib/assets/icons/up.svelte';
	import type { PageData } from './$types';
	import type { DisclosuresSetWithIncludes } from '$lib/types/types';
	import DeleteIcon from '$lib/assets/icons/delete.svelte';
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import { invalidate } from '$app/navigation';
	import { flip } from 'svelte/animate';
	import { getContext, onMount } from 'svelte';
	import { type Writable, writable } from 'svelte/store';

	export let data: PageData;

	const toastStore = getToastStore();
	const modalStore = getModalStore();

	const pendingStore = getContext<Writable<Boolean>>('pendingStore');

	const creatingDisclosuresSetStore = writable<boolean>(false);

	$: ({ disclosuresSets } = data);
	let disclosuresSet: DisclosuresSetWithIncludes | null = null;

	$: selectedDisclosureSetId = disclosuresSet?.id ?? '';

	let orderedDisclosures: any[] = [];

	const generateRandomUuid = () => {
		return crypto.randomUUID();
	};

	onMount(() => {
		orderedDisclosures =
			disclosuresSet?.disclosures.sort((a, b) => Number(a.order) - Number(b.order)) ?? [];
	});

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

	const addNewDisclosure = () => {
		const newDisclosure: any = {
			id: `new ${generateRandomUuid()}`,
			title: '',
			description: '',
			order: String(orderedDisclosures.length)
		};
		orderedDisclosures = [...orderedDisclosures, newDisclosure];
	};

	const deleteDisclosuresSet = () => {
		pendingStore.set(true);
		if (disclosuresSet?.id === undefined) {
			pendingStore.set(false);
			return;
		}
		new Promise<boolean>((resolve) => {
			modalStore.trigger({
				type: 'confirm',
				title: 'Confirm Delete',
				body: 'Are you sure you wish to delete this disclosures set (this is irreversible)?',
				response: (r: boolean) => {
					resolve(r);
				}
			});
		}).then(async (r) => {
			if (!r) {
				pendingStore.set(false);
				return;
			}

			await fetch(`/api/disclosuresSets?id=${disclosuresSet?.id}`, {
				method: 'DELETE'
			})
				.then(async (res) => {
					if (res.ok) {
						invalidate('form:disclosuresSet');
						disclosuresSet = (await res.json()) as DisclosuresSetWithIncludes;
						orderedDisclosures =
							disclosuresSet?.disclosures.sort((a, b) => Number(a.order) - Number(b.order)) ?? [];
						toastStore.trigger({ message: '👍 Disclosures Set deleted successfully' });
						pendingStore.set(false);
					}
				})
				.catch((err) => {
					toastStore.trigger({ message: `❗️ Error deleting disclosures set ${err}` });
					pendingStore.set(false);
				});
		});
	};

	const deleteDisclosure = (id: string) => {
		pendingStore.set(true);
		if (id === undefined) {
			return;
		}
		new Promise<boolean>((resolve) => {
			modalStore.trigger({
				type: 'confirm',
				title: 'Confirm Delete',
				body: 'Are you sure you wish to delete this disclosure (this is irreversible)?',
				response: (r: boolean) => {
					resolve(r);
				}
			});
		}).then(async (r) => {
			if (!r) {
				pendingStore.set(false);
				return;
			}

			await fetch(`/api/disclosures?id=${id}&disclosuresSetId=${disclosuresSet?.id}`, {
				method: 'DELETE'
			})
				.then(async (res) => {
					if (res.ok) {
						invalidate('form:disclosuresSet');
						disclosuresSet = (await res.json()) as DisclosuresSetWithIncludes;
						orderedDisclosures =
							disclosuresSet?.disclosures.sort((a, b) => Number(a.order) - Number(b.order)) ?? [];
						toastStore.trigger({ message: '👍 Disclosure deleted successfully' });
						pendingStore.set(false);
					}
				})
				.catch((err) => {
					toastStore.trigger({ message: `❗️ Error deleting disclosure ${err}` });
					pendingStore.set(false);
				});
		});
	};

	let emptyDisclosuresSet = {
		id: `new ${generateRandomUuid()}`,
		name: '',
		disclosures: []
	};
	const createEmptyDisclosuresSet = () => {
		orderedDisclosures = [];
		disclosuresSet = emptyDisclosuresSet;
	};

	const handleSelect = async (e: Event) => {
		const disclosuresSetId = (e.target as HTMLSelectElement).value;
		e.preventDefault();

		pendingStore.set(true);
		creatingDisclosuresSetStore.set(false);

		await fetch(`/api/disclosuresSets?id=${disclosuresSetId}`)
			.then(async (res) => {
				if (res.ok) {
					disclosuresSet = (await res.json()) as DisclosuresSetWithIncludes;
					orderedDisclosures =
						disclosuresSet?.disclosures.sort((a, b) => Number(a.order) - Number(b.order)) ?? [];
					invalidate('data:disclosuresSets');
					pendingStore.set(false);
				}
			})
			.catch((err) => {
				toastStore.trigger({ message: `❗️ Error fetching Disclosures Set ${err}` });
				pendingStore.set(false);
			});
	};

	const handleSave = async (e: Event) => {
		e.preventDefault();

		pendingStore.set(true);
		const formData = new FormData(e.target as HTMLFormElement);

		await fetch('/api/disclosures', {
			method: 'POST',
			body: formData
		})
			.then(async (res) => {
				if (res.ok) {
					disclosuresSet = (await res.json()) as DisclosuresSetWithIncludes;
					orderedDisclosures =
						disclosuresSet?.disclosures.sort((a, b) => Number(a.order) - Number(b.order)) ?? [];
					invalidate('data:disclosuresSets');
					toastStore.trigger({ message: '👍 Disclosure updated successfully' });
					pendingStore.set(false);
					creatingDisclosuresSetStore.set(false);
				}
			})
			.catch((err) => {
				toastStore.trigger({ message: `❗️ Error updating Disclosures Set ${err}` });
				pendingStore.set(false);
				creatingDisclosuresSetStore.set(false);
			});
	};

	const clearDisclosuresSet = () => {
		disclosuresSet = null;
		orderedDisclosures = [];
	};
</script>

{#if !disclosuresSet}
	<div class="flex px-8 pt-8 mb-4">
		<button
			type="button"
			class="btn bg-gradient-to-br variant-gradient-primary-secondary"
			on:click={createEmptyDisclosuresSet}>Create New Disclosures Set</button
		>
	</div>
	<div class="flex gap-2 px-8 mb-4">
		<span>- OR -</span>
	</div>
	<div class="flex gap-2 px-8">
		<div class="flex flex-col w-full gap-2">
			<select
				class="select"
				name="selectedDisclosuresSetId"
				on:change={handleSelect}
				bind:value={selectedDisclosureSetId}
			>
				{#if disclosuresSets}
					<option value disabled>Select an Existing Disclosures Set</option>
					{#each disclosuresSets.sort( (a, b) => (b.name > a.name ? 1 : b.name < a.name ? -1 : 0) ) as set}
						<option value={set.id} selected={set.id === selectedDisclosureSetId}>
							{set.name}
						</option>
					{/each}
				{/if}
			</select>
		</div>
	</div>
{/if}

<!-- <form
	method="POST"
	action="?/selectDisclosuresSet"
	bind:this={selectForm}
	use:enhance={() => {
		return async ({ update }) => {
			await update();
			emptyDisclosuresSet = {
				id: `new ${generateRandomUuid()}`,
				name: '',
				disclosures: []
			};
		};
	}}
>
	<div class="flex gap-2 p-8">
		<div class="flex flex-col w-full">
			<label for="selectedDisclosuresSetId" class="label">Disclosure Sets</label>
			<select
				class="select"
				name="selectedDisclosuresSetId"
				on:change={() => selectForm.submit()}
				bind:value={selectedDisclosureSet}
			>
				{#if disclosuresSets}
					<option value disabled>Make a selection</option>
					{#each disclosuresSets as set}
						<option value={set.id} selected={set.id === disclosuresSet?.id}>
							{set.name}
						</option>
					{/each}
				{/if}
			</select>
		</div>
	</div>
</form>
{#if !disclosuresSet}
	<div class="flex px-8">
		
	</div>
{/if} -->
<div class="flex flex-col gap-4 px-8">
	{#if disclosuresSet}
		<form class="flex flex-col gap-3" on:submit|preventDefault={handleSave} method="POST">
			<input type="hidden" name="disclosuresSetId" value={disclosuresSet.id} />
			<div
				class="flex gap-2 justify-between sticky top-0 bg-surface-50-900-token z-10 px-8 py-4 -mx-8 border-b border-surface-100-800-token"
			>
				<div class="inline-flex gap-4">
					<h2>{disclosuresSet.name}</h2>
					{#if disclosuresSet.id !== 'new'}
						<button
							type="button"
							on:click={deleteDisclosuresSet}
							class="btn bg-gradient-to-br variant-filled-error"
						>
							Delete
						</button>
					{/if}
				</div>
				<div class="inline-flex gap-2">
					<button type="submit" class="btn bg-gradient-to-br variant-gradient-primary-secondary">
						Save
					</button>
					<button
						type="button"
						on:click={clearDisclosuresSet}
						class="btn bg-gradient-to-br variant-filled-tertiary"
					>
						Cancel
					</button>
				</div>
			</div>
			<label for="title" class="label mb-8"
				>Name
				<input class="input" name="name" value={disclosuresSet.name} />
			</label>

			{#if disclosuresSet?.disclosures}
				{#each orderedDisclosures as disclosure (disclosure.id)}
					<div
						class="card !bg-surface-100-800-token p-4 flex items-start gap-2"
						animate:flip={{ duration: 200 }}
					>
						<div class="flex flex-col gap-2 w-full">
							<input type="hidden" name={`disclosureId`} value={disclosure.id} />
							<input type="hidden" name={`disclosureOrder`} value={disclosure.order} />
							<label for="disclosureTitle" class="label">
								Title
								<input
									type="text"
									class="input p-2"
									name={`disclosureTitle`}
									bind:value={disclosure.title}
								/>
							</label>
							<label for="disclosureDescription" class="label">
								Description

								<textarea
									class="textarea"
									name={`disclosureDescription`}
									bind:value={disclosure.description}
								/>
							</label>
						</div>
						<div class="flex flex-col gap-2 ml-4">
							<button
								type="button"
								class="btn btn-icon variant-filled w-6 h-6"
								disabled={disclosure.order === '0'}
								on:click={() => moveUp(disclosure.order)}
							>
								<svelte:component this={UpIcon} />
							</button>
							<button
								type="button"
								class="btn btn-icon variant-filled w-6 h-6 rotate-180 mb-8"
								disabled={Number(disclosure.order) === orderedDisclosures.length - 1}
								on:click={() => moveDown(disclosure.order)}
							>
								<svelte:component this={UpIcon} />
							</button>
							<button
								type="button"
								on:click={() => deleteDisclosure(disclosure.id)}
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
				class="btn bg-gradient-to-br variant-gradient-primary-secondary"
				on:click={addNewDisclosure}
				><span class="text-2xl leading-none mr-2">+</span> Add Disclosure</button
			>
		</div>
	{/if}
</div>
