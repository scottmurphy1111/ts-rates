<script lang="ts">
	import type { DisclosuresSetWithIncludes, RatesheetWithIncludes } from '$lib/types/types';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	export let ratesheet: RatesheetWithIncludes | null = null;
	export let disclosuresSets: DisclosuresSetWithIncludes[] = [];

	const creatingRatesheetStore = getContext<Writable<Boolean>>('creatingRatesheetStore');

	$: selectedDisclosureSetId = ratesheet?.disclosuresSetId ?? undefined;
</script>

<div class="flex flex-col gap-2">
	<h2 class="h2">Disclosures Set</h2>
	{#if disclosuresSets.length === 0}
		<input hidden name="selectedDisclosureSetId" value="test" />
		Please create a Disclosure Set First
	{:else if $creatingRatesheetStore}
		Save Ratesheet First
	{:else}
		<div>
			<div class="flex flex-col w-full">
				<select class="select" name="selectedDisclosuresSetId" value={selectedDisclosureSetId}>
					{#if disclosuresSets}
						<option value disabled>Make a selection</option>
						{#each disclosuresSets.sort( (a, b) => (b.name > a.name ? 1 : b.name < a.name ? -1 : 0) ) as set}
							<option value={set.id} selected={set.id === selectedDisclosureSetId}>
								{set.name}
							</option>
						{/each}
					{/if}
				</select>
			</div>
		</div>
		<div class="flex flex-col gap-2">
			<div class="flex flex-col gap-2">
				{#if ratesheet?.disclosuresSet?.disclosures}
					<div class="grid grid-cols-[1fr_3fr] gap-2 p-4">
						<span>Title</span>
						<span>Description</span>
					</div>
					{#each ratesheet?.disclosuresSet?.disclosures.sort((a, b) => Number(a.order) - Number(b.order)) as disclosure}
						<div class="table grid grid-cols-[1fr_3fr] gap-2 p-4">
							<span>{disclosure.title}</span>
							<span>{disclosure.description}</span>
						</div>
					{/each}
				{/if}
			</div>
		</div>
	{/if}
</div>
