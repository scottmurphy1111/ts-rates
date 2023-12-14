<script lang="ts">
	import type { CoveragesSetWithIncludes, RatesheetWithIncludes } from '$lib/types/types';

	export let ratesheet: RatesheetWithIncludes | null = null;
	export let coveragesSets: CoveragesSetWithIncludes[] = [];

	$: selectedCoverageSet = ratesheet?.coveragesSet?.id ?? '';
</script>

<div class="flex flex-col gap-2">
	<h2 class="h2">Coverages Set</h2>
	{#if coveragesSets.length === 0}
		<!-- content here -->
		Please create a Coverages Set First
	{:else}
		<div>
			<div class="flex flex-col w-full">
				<label for="selectedCoveragesSetId" class="label">Coverage Sets</label>
				<select class="select" name="selectedCoveragesSetId" value={selectedCoverageSet}>
					{#if coveragesSets}
						<option value disabled>Make a selection</option>
						{#each coveragesSets as set}
							<option value={set.id} selected={set.id === selectedCoverageSet}>
								{set.name}
							</option>
						{/each}
					{/if}
				</select>
			</div>
		</div>
		<div class="flex flex-col gap-2">
			<h3 class="h3">Coverages</h3>
			<div class="flex flex-col gap-2">
				{#if ratesheet?.coveragesSet.coverages}
					<div class="grid grid-cols-[1fr_3fr] gap-2 p-4">
						<span>Title</span>
						<span>Description</span>
					</div>
					{#each ratesheet?.coveragesSet.coverages.sort((a, b) => Number(a.order) - Number(b.order)) as coverage}
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
