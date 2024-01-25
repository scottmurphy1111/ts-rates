<script lang="ts">
	import { localStorageStore } from '@skeletonlabs/skeleton';
	import type { RatesheetWithIncludes } from '$lib/types/types';

	export let ratesheetData = {} as RatesheetWithIncludes;
	export let color: string;

	let colorText = `text-${color}-500`;
</script>

<!-- Disclosures -->
<h3 class="h3 text-2xl font-semibold mb-2">Disclosures</h3>
<div class="card shadow-xl p-8 mb-8">
	<div class="flex flex-col gap-8 items-start">
		{#each ratesheetData?.disclosuresSet.disclosures.sort((a, b) => Number(a.order) - Number(b.order)) as disclosure}
			<div class="flex flex-col gap-1 extrabold">
				<h3 class="h3 uppercase text-base {colorText} font-extrabold">
					{@html disclosure.title}
				</h3>
				<p class="text-base">{@html disclosure.description}</p>
			</div>
		{/each}
	</div>
</div>
