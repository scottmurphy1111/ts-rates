<script lang="ts">
	import logo from '$lib/assets/images/ts-logo.svg';
	import JustDriveIcon from '$lib/assets/icons/just-drive.svelte';

	import { writable, type Writable } from 'svelte/store';
	import { enhance } from '$app/forms';
	// import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import { localStorageStore } from '@skeletonlabs/skeleton';
	import { fade, fly, slide } from 'svelte/transition';
	// import path from 'path';
	// import { writeFileSync } from 'fs';

	export let data: PageData;

	const { ratesheets } = data;

	let selectedRatesheetId = writable(ratesheets?.[0]?.id ?? '');
	let markup12 = writable(500);
	let markup24 = writable(1000);
	let markup36 = writable(1500);
	let markup48 = writable(2000);
	let selectedColor = writable('primary');
	const customLogo = writable(null);

	const ratesheetIdStorage: Writable<string> = localStorageStore(
		'ratesheetId',
		$selectedRatesheetId
	);
	// const markup12Storage: Writable<number> = localStorageStore('markup', $markup);
	// const colorStorage: Writable<string> = localStorageStore('color', $color);
	const customLogoStorage: Writable<string | null> = localStorageStore('customLogo', $customLogo);
	$: colorBg = `bg-${$selectedColor}-500`;

	// $: console.log($color);

	// $: console.log($ratesheetIdStorage);
	// $: console.log($customLogoStorage);

	// // const cardTypes = writable<string[]>([]);

	// // $: splitTypes = $cardTypes?.toString();

	// // async function sendToOutput() {
	// // 	ratesheetIdStorage.set($selectedRatesheetId);
	// // 	markupStorage.set($markup);
	// // 	customLogoStorage.set($customLogo);
	// // const data = {
	// // 	cardTypes: splitTypes,
	// // 	markup: $markup.toString(),
	// // 	customLogo: $customLogo
	// // };

	// // const customLogo = data.get('customLogo');

	// // if (!cardTypes || !markup) {
	// // 	return fail(400, { err: 'Cannot create Rate Card Template' });
	// // }
	// // cookies.set('cardTypes', JSON.stringify(cardTypes), { maxAge: 24 * 60 * 60 });
	// // cookies.set('markup', JSON.stringify(markup), { maxAge: 24 * 60 * 60 });

	// // if (($customLogo as File).size) {
	// // 	const file = $customLogo as File;
	// // 	const imageResource = `customLogos/${crypto.randomUUID()}.${file.type.split('/')[1]}`;
	// // 	const filePath = path.join(process.cwd(), 'static', imageResource);

	// // 	writeFileSync(filePath, Buffer.from(await file.arrayBuffer()));
	// // 	// cookies.set('customLogo', imageResource, { maxAge: 24 * 60 * 60 });
	// // } else {
	// // 	// cookies.set('customLogo', '', { maxAge: -1 });
	// // }

	// // 	goto('/output', { state: data });
	// // }

	// // const products: Record<string, any> = {
	// // 	class_8: 'Class 8 Diesel - Commercial Truck',
	// // 	class_8_FL: 'Class 8 Diesel - Commercial Truck - Freightliner',
	// // 	class_8_30_day: 'Class 8 Diesel - Commercial Truck - 30 Day',
	// // 	class_5_7_Diesel: 'Class 5-7 Diesel - Commercial Truck',
	// // 	class_5_7_Gas: 'Class 5-7 Gas - Commercial Truck',
	// // 	class_3_4_Diesel: 'Class 3-4 Diesel - Commercial Truck',
	// // 	class_3_4_Gas: 'Class 3-4 Gas - Commercial Truck'
	// // };

	// // const tableData = [
	// // 	{
	// // 		term: '12 month',
	// // 		mileage: '125,000',
	// // 		aggregateLimit: '30,000',
	// // 		specs: {
	// // 			ageRange: '0 - 5 years',
	// // 			milesRange: '0 - 600,000 miles',
	// // 			cost: 4000
	// // 		},
	// // 		deductible: 350,
	// // 		options: [
	// // 			{
	// // 				type: 'TransDiff',
	// // 				cost: 475
	// // 			},
	// // 			{
	// // 				type: 'HVAC',
	// // 				cost: 450
	// // 			}
	// // 		],
	// // 		coveragesContent: [
	// // 			{
	// // 				title: 'Engine',
	// // 				body: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nostrum dolorum deleniti quae modi numquam, repellat esse provident reprehenderit ipsum, ea, ducimus ut perspiciatis impedit doloribus illum eveniet minima ullam consectetur?'
	// // 			},
	// // 			{
	// // 				title: 'Aftertreatment',
	// // 				body: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nostrum dolorum deleniti quae modi numquam, repellat esse provident reprehenderit ipsum, ea, ducimus ut perspiciatis impedit doloribus illum eveniet minima ullam consectetur?'
	// // 			}
	// // 		]
	// // 	}
	// // ];

	$: active = false;

	const toggleColorPicker = () => {
		active = !active;
	};

	const setColor = (color: string) => {
		console.log(color);
		selectedColor.set(color);
		// colorStorage.set(color);
		toggleColorPicker();
	};
</script>

<div class="w-full gap-8 flex flex-col p-4 items-center justify-center">
	<div class="card shadow-xl min-w-1/4 p-8 justify-center items-center">
		<div class="flex flex-col mb-4 gap-4 items-center justify-center w-full">
			<a class="flex items-center justify-center max-w-[400px]" href="/">
				<img class="block w-full" src={logo} alt="ts-logo" />
			</a>
			<h2 class="text-xl text-center p-0">Ratesheet Generator</h2>
		</div>
		<form method="post" use:enhance>
			<div class="flex flex-col gap-8">
				<label class="label" for="selectedRatesheetId">
					Make Selection
					<select
						required
						class="select"
						bind:value={$selectedRatesheetId}
						name="selectedRatesheetId"
					>
						<option value disabled>Pick a Ratesheet</option>
						{#each ratesheets as ratesheet}
							<option value={ratesheet.id}>{ratesheet.title}</option>
						{/each}
					</select>
				</label>
				<h3 class="h3">Markups</h3>
				<label class="label" for="markup"
					>12 Month Markup
					<input type="text" class="input" value={$markup12} name="markup12" required />
				</label>
				<label class="label" for="markup"
					>24 Month Markup
					<input type="text" class="input" value={$markup24} name="markup24" required />
				</label>
				<label class="label" for="markup"
					>36 Month Markup
					<input type="text" class="input" value={$markup36} name="markup36" required />
				</label>
				<label class="label" for="markup"
					>48 Month Markup
					<input type="text" class="input" value={$markup48} name="markup48" required />
				</label>
				<div class="flex flex-col gap-8">
					<div class="relative w-full">
						<span class="absolute top-[12px] left-6 z-10 flex w-4 h-4 rounded-full mr-2 {colorBg}"
						></span>
						<button type="button" class="select" on:click={toggleColorPicker}>
							Pick a Color
						</button>
					</div>

					<input hidden name="selectedColor" value={$selectedColor} />
					{#if active}
						<div class="inline-flex gap-2 w-full">
							<button
								type="button"
								class="cursor-pointer w-8 h-8 flex bg-primary-500"
								on:click={() => setColor('primary')}
							></button>
							<button
								type="button"
								class="cursor-pointer w-8 h-8 flex bg-sky-500"
								on:click={() => setColor('sky')}
							></button>
							<button
								type="button"
								class="cursor-pointer w-8 h-8 flex bg-amber-500"
								on:click={() => setColor('amber')}
							></button>
							<button
								type="button"
								class="cursor-pointer w-8 h-8 flex bg-rose-500"
								on:click={() => setColor('rose')}
							></button>
							<button
								type="button"
								class="cursor-pointer w-8 h-8 flex bg-red-500"
								on:click={() => setColor('red')}
							></button>
							<button
								type="button"
								class="cursor-pointer w-8 h-8 flex bg-teal-500"
								on:click={() => setColor('teal')}
							></button>
							<button
								type="button"
								class="cursor-pointer w-8 h-8 flex bg-indigo-500"
								on:click={() => setColor('indigo')}
							></button>
							<button
								type="button"
								class="cursor-pointer w-8 h-8 flex bg-slate-500"
								on:click={() => setColor('slate')}
							></button>
						</div>
					{/if}
					<label class="flex flex-col gap-2 font-semibold justify-center text-base" for="customLogo"
						>Link to a Custom Logo (Optional)
						<input class="input" type="text" name="customLogo" bind:value={$customLogo} />
					</label>
					<button class="btn variant-filled-primary">Generate</button>
				</div>
			</div>
		</form>
		<div class="w-full mt-8 flex justify-center items-center">
			<div class="w-2/5">
				<JustDriveIcon />
			</div>
		</div>
	</div>
	<!-- </div> -->
</div>
