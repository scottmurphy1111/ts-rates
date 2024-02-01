<script lang="ts">
	import type { CoveragesSetWithIncludes, RatesheetWithIncludes } from '$lib/types/types';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	export let ratesheet: RatesheetWithIncludes | null = null;
	export let coveragesSets: CoveragesSetWithIncludes[] = [];

	const creatingRatesheetStore = getContext<Writable<Boolean>>('creatingRatesheetStore');

	$: selectedCoverageSetId = ratesheet?.coveragesSetId ?? undefined;
</script>

<div class="flex flex-col gap-2">
	<h2 class="h2">Coverages Set</h2>
	{#if coveragesSets.length === 0}
		<input hidden name="selectedCoveragesSetId" value="test" />
		Please create a Coverages Set First
	{:else if $creatingRatesheetStore}
		Save Ratesheet First
	{:else}
		<div>
			<div class="flex flex-col w-full">
				<select class="select" name="selectedCoveragesSetId" value={selectedCoverageSetId}>
					{#if coveragesSets}
						<option value disabled>Make a selection</option>
						{#each coveragesSets.sort( (a, b) => (b.name > a.name ? 1 : b.name < a.name ? -1 : 0) ) as set}
							<option value={set.id} selected={set.id === selectedCoverageSetId}>
								{set.name}
							</option>
						{/each}
					{/if}
				</select>
			</div>
		</div>
		<div class="flex flex-col gap-2">
			<div class="flex flex-col gap-2">
				{#if ratesheet?.coveragesSet?.coverages}
					<div class="grid grid-cols-[1fr_3fr] gap-2 p-4">
						<span>Title</span>
						<span>Description</span>
					</div>
					{#each ratesheet?.coveragesSet?.coverages.sort((a, b) => Number(a.order) - Number(b.order)) as coverage}
						<div class="table grid grid-cols-[1fr_3fr] gap-2 p-4">
							<span>{coverage.title}</span>
							<span>{coverage.description}</span>
						</div>
					{/each}
				{/if}
			</div>
		</div>
	{/if}
</div>
