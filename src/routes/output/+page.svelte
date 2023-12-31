<script lang="ts">
	import TsLogoDark from '$lib/assets/images/ts-logo-dark.svg';
	import TsLogo from '$lib/assets/images/ts-logo.svg';
	import QrCode from '$lib/assets/images/qr-code.svg';
	import Mobile from '$lib/assets/images/mobile.svg';
	import RatesOutput from './RatesOutput.svelte';
	import OptionsOutput from './OptionsOutput.svelte';
	import DisclosuresOutput from './DisclosuresOutput.svelte';
	import CoveragesOutput from './CoveragesOutput.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ output, ratesheet } = data);
	$: colorFrom = `from-${output?.color}-500`;
	$: colorTo = `to-${output?.color}-900`;
</script>

{#if ratesheet && output}
	{#if Object.keys(ratesheet).length}
		<div class="flex flex-col">
			<header
				class="bg-gradient-to-br {colorFrom} {colorTo} p-8 w-full text-white inline-flex justify-between items-center gap-16 shadow-xl"
			>
				<div class="w-2/3 flex gap-4 items-center">
					{#if output?.logoUrl}
						<img class="w-1/2" src={output.logoUrl} alt="Custom Logo" />
					{:else}
						<a href="/">
							<img class="w-full" src={TsLogoDark} alt="ts-logo-dark" />
						</a>
					{/if}
				</div>
				<div class="w-1/3 ml-auto">
					<h2 class="h2">
						{ratesheet?.title}
					</h2>
					<h3 class="h3 font-semibold">
						{ratesheet?.subtitle}
					</h3>
					{#if output?.logoUrl}
						<a class="" href="/">
							<img class="w-2/5 mt-4" src={TsLogoDark} alt="ts-logo-dark" />
						</a>
					{/if}
				</div>
			</header>
			<main>
				<div class="flex flex-col gap-4 p-8 text-sm">
					<RatesOutput ratesheetData={ratesheet} markups={output.markups} />
					<OptionsOutput ratesheetData={ratesheet} />
					<DisclosuresOutput ratesheetData={ratesheet} color={output.color} />
					<CoveragesOutput ratesheetData={ratesheet} color={output.color} />
				</div>
			</main>
			<footer class="flex flex-col gap-4 bg-white p-8">
				<div class="flex gap-4 justify-between">
					<div class="flex flex-col gap-1">
						<a href="http://trucksuite.com">
							<img class="w-full mb-4" src={TsLogo} alt="ts-logo" />
						</a>
						<a class="text-xl" href="tel:336-565-7100">336-565-7100</a>
						<a class="text-base text-blue-500 mb-1" href="mailto:support@trucksuite.com"
							>support@trucksuite.com</a
						>
						<p>154 Charlois Blvd. Winston Salem, NC 27103</p>
					</div>
					<div class="flex flex-col gap-1">
						<div class="flex gap-4">
							<img class="w-[60px] mb-4" src={Mobile} alt="mobile-app" />
							<img class="w-[100px] mb-4" src={QrCode} alt="qr-code" />
						</div>
						<p class="mb-2">Download the TruckSuite Mobile App</p>
						<p class="text-sm text-primary-500">Available for iOS & Android</p>
						<p class="w-full text-left text-sm">
							© {new Date().getFullYear()} TruckSuite. All rights reserved.
						</p>
					</div>
				</div>
			</footer>
		</div>
	{/if}
{/if}
