<script lang="ts">
	import { localStorageStore } from '@skeletonlabs/skeleton';
	import type { RatesheetWithIncludes } from '$lib/types/types';

	export let ratesheetData = {} as RatesheetWithIncludes;
	export let color: string;

	// const colorStorage = localStorageStore('color', 'primary');
	let colorText = `text-${color}-500`;
</script>

<!-- Coverages -->
<h3 class="h3 text-2xl font-semibold mb-2">Coverages</h3>
<div class="card shadow-xl p-8 mb-8">
	<div class="flex flex-col gap-8 items-start">
		{#each ratesheetData?.coveragesSet.coverages.sort((a, b) => Number(a.order) - Number(b.order)) as coverage}
			<div class="flex flex-col gap-1 extrabold">
				<h3 class="h3 uppercase text-sm {colorText} font-extrabold">
					{@html coverage.title}
				</h3>
				<p>{@html coverage.description}</p>
			</div>
		{/each}
	</div>
</div>
