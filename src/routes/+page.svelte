<script lang="ts">
	import logo from '$lib/assets/images/ts-logo.svg';
	import JustDriveIcon from '$lib/assets/icons/just-drive.svelte';

	import { writable } from 'svelte/store';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	const cardTypes = writable<string[]>([]);
	const markup = writable(1000);
	const customLogo = writable(null);

	$: splitTypes = $cardTypes?.toString();

	function sendToOutput() {
		const data = {
			cardTypes: splitTypes,
			markup: $markup.toString(),
			customLogo: $customLogo
		};
		console.log('data', data);
		goto('/output', { state: data });
		// fetch('/output', {
		// 	method: 'POST',
		// 	headers: {
		// 		'Content-Type': 'application/json'
		// 	},
		// 	body: JSON.stringify(data)
		// }).then((res) => {
		// 	console.log('res', res);
		// });
	}

	const products: Record<string, any> = {
		class_8: 'Class 8 Diesel - Commercial Truck',
		class_8_FL: 'Class 8 Diesel - Commercial Truck - Freightliner',
		class_8_30_day: 'Class 8 Diesel - Commercial Truck - 30 Day',
		class_5_7_Diesel: 'Class 5-7 Diesel - Commercial Truck',
		class_5_7_Gas: 'Class 5-7 Gas - Commercial Truck',
		class_3_4_Diesel: 'Class 3-4 Diesel - Commercial Truck',
		class_3_4_Gas: 'Class 3-4 Gas - Commercial Truck'
	};

	const tableData = [
		{
			term: '12 month',
			mileage: '125,000',
			aggregateLimit: '30,000',
			specs: {
				ageRange: '0 - 5 years',
				milesRange: '0 - 600,000 miles',
				cost: 4000
			},
			deductible: 350,
			options: [
				{
					type: 'TransDiff',
					cost: 475
				},
				{
					type: 'HVAC',
					cost: 450
				}
			],
			coveragesContent: [
				{
					title: 'Engine',
					body: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nostrum dolorum deleniti quae modi numquam, repellat esse provident reprehenderit ipsum, ea, ducimus ut perspiciatis impedit doloribus illum eveniet minima ullam consectetur?'
				},
				{
					title: 'Aftertreatment',
					body: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nostrum dolorum deleniti quae modi numquam, repellat esse provident reprehenderit ipsum, ea, ducimus ut perspiciatis impedit doloribus illum eveniet minima ullam consectetur?'
				}
			]
		}
	];
</script>

<div class="w-full gap-8 flex flex-col justify-center items-center p-4">
	<div class="flex flex-col mb-4 gap-4 items-center">
		<a class="flex" href="/">
			<img class="block w-full" src={logo} alt="ts-logo" />
		</a>
		<h2 class="text-xl text-center p-0">Rate Card Generator</h2>
	</div>
	<form method="post" use:enhance enctype="multipart/form-data">
		<div class="flex flex-col gap-8">
			<label class="flex flex-col gap-2 font-semibold justify-center text-base" for="cardTypes">
				Select Product(s)
				<select
					required
					multiple
					class="border border-ts-gray-md rounded py-3 px-4 h-48"
					bind:value={$cardTypes}
					name="cardTypes"
				>
					{#each Object.keys(products) as product (product)}
						<option value={product}>{products[product]}</option>
					{/each}
				</select></label
			>
			<label class="flex flex-col gap-2 font-semibold justify-center text-base" for="markup"
				>Markup
				<input
					type="number"
					class="border border-ts-gray-md rounded py-3 px-4"
					bind:value={$markup}
					name="markup"
					required
				/>
			</label>
			<label class="flex flex-col gap-2 font-semibold justify-center text-base" for="customLogo"
				>Upload a Logo (Optional)
				<input
					type="file"
					name="customLogo"
					accept="image/png, image/jpeg"
					bind:value={$customLogo}
				/>
			</label>
			<button class="btn btn-primary">Generate</button>
			<!-- <label class="flex flex-col gap-2 font-semibold justify-center text-base"
				>Term Length
				<select class="border border-ts-gray-md rounded py-3 px-4" bind:value={$term}>
					{#each termOptions as option}
						<option value={option.year}>{option.label} Months</option>
					{/each}
				</select>
			</label> -->
			<!-- <div>
				<span class="font-medium mb-2 flex">Your estimated weekly payment amount is:</span>
				<div class="w-full flex flex-col font-semibold mb-4 text-center">
					<span class="w-full inline-flex text-4xl justify-center">
						${weeklyTotal}*
					</span>
				</div>
				<span
					class="font-medium flex max-w-[325px] text-ts-blue text-xs italic leading-tight tracking-tight antialiased"
					>* This is an estimate. The final weekly payment amount is based upon credit history,
					subject to credit approval and may differ from the above calculation.</span
				>
			</div> -->
		</div>
	</form>
	<div class="w-full mt-8 flex justify-center items-center">
		<div class="w-1/3">
			<JustDriveIcon />
		</div>
	</div>
	<!-- </div> -->
</div>
