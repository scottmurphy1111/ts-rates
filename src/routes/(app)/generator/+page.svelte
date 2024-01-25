<script lang="ts">
	import logo from '$lib/assets/images/ts-logo.svg';
	import JustDriveIcon from '$lib/assets/icons/just-drive.svelte';
	import { writable, type Writable } from 'svelte/store';
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	export let data: PageData;

	const { ratesheets } = data;

	let selectedRatesheetId = writable(ratesheets?.[0]?.id ?? '');
	let markup12 = writable(500);
	let markup24 = writable(1000);
	let markup36 = writable(1500);
	let markup48 = writable(2000);
	let selectedColor = writable('primary');
	let label = writable('');
	const customLogo = writable(null);

	$: colorBg = `bg-${$selectedColor}-500`;
	$: active = false;

	const toggleColorPicker = () => {
		active = !active;
	};

	const setColor = (color: string) => {
		selectedColor.set(color);
		toggleColorPicker();
	};
</script>

<div class="w-full gap-8 flex flex-col p-4 items-center justify-center">
	<div class="card shadow-xl min-w-1/4 p-8 justify-center items-center">
		<div class="flex flex-col mb-4 gap-4 items-center justify-center w-full">
			<a class="flex items-center justify-center max-w-[400px]" href="/admin">
				<img class="block w-full" src={logo} alt="ts-logo" />
			</a>
			<h2 class="text-xl text-center p-0">Ratesheet Generator</h2>
		</div>
		<form method="post" use:enhance>
			<div class="flex flex-col gap-8">
				<label class="label" for="selectedRatesheetId">
					Select a Ratesheet
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
								class="cursor-pointer w-8 h-8 flex bg-stone-500"
								on:click={() => setColor('stone')}
							></button>
							<button
								type="button"
								class="cursor-pointer w-8 h-8 flex bg-emerald-500"
								on:click={() => setColor('emerald')}
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
					<label class="flex flex-col gap-2 font-semibold justify-center text-base" for="label">
						Label (e.g. "Class 8 +1000 for XYZ Dealer")
						<input type="text" name="label" value={$label} />
					</label>
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
</div>
