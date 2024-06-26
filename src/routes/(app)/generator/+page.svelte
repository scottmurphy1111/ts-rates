<script lang="ts">
	import logo from '$lib/assets/images/ts-logo.svg';
	import logoDark from '$lib/assets/images/ts-logo-dark.svg';
	import JustDriveIcon from '$lib/assets/images/just-drive.svg';
	import JustDriveIconDark from '$lib/assets/images/just-drive-dark.svg';
	import { writable, type Writable } from 'svelte/store';
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	import { getContext } from 'svelte';
	import InfoCircleIcon from '$lib/assets/icons/info-circle.svelte';
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import CustomLogoInstructions from '$lib/assets/images/custom-logo-instructions.png';

	export let data: PageData;

	const { ratesheets } = data;

	const pendingStore = getContext<Writable<Boolean>>('pendingStore');

	let selectedRatesheetId = writable(ratesheets?.[0]?.id ?? '');
	let markup12 = writable(0);
	let markup24 = writable(0);
	let markup36 = writable(0);
	let markup48 = writable(0);
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

	const modalStore = getModalStore();

	const modal: ModalSettings = {
		type: 'component',
		component: 'modalImage',
		image: CustomLogoInstructions
	};

	function openInstructions() {
		modalStore.trigger(modal);
	}
</script>

<div class="w-full gap-8 flex flex-col p-4 items-center justify-center">
	<div class="card shadow-xl min-w-1/4 p-8 justify-center items-center">
		<div class="flex flex-col mb-4 gap-4 items-center justify-center w-full">
			<a class="flex items-center justify-center max-w-[400px]" href="/dashboard">
				<img class="block dark:hidden w-full" src={logo} alt="ts-logo" />
				<img class="hidden dark:block w-full" src={logoDark} alt="ts-logo" />
			</a>
			<h2 class="text-xl text-center p-0">Ratesheet Generator</h2>
		</div>
		<form
			method="post"
			use:enhance={() => {
				pendingStore.set(true);
				return async ({ update }) => {
					await update();
				};
			}}
		>
			<div class="flex flex-col gap-8">
				<label class="label" for="selectedRatesheetId">
					*Select a Ratesheet
					<select
						required
						class="select"
						bind:value={$selectedRatesheetId}
						name="selectedRatesheetId"
					>
						<option value disabled>Pick a Ratesheet</option>
						{#each ratesheets.sort( (a, b) => (b.name > a.name ? 1 : b.name < a.name ? -1 : 0) ) as ratesheet}
							<option value={ratesheet.id}>{ratesheet.title}</option>
						{/each}
					</select>
				</label>
				<h3 class="h3">Markups</h3>
				<label class="label" for="markup"
					>*12 Month Markup
					<input type="text" class="input" value={$markup12} name="markup12" required />
				</label>
				<label class="label" for="markup"
					>*24 Month Markup
					<input type="text" class="input" value={$markup24} name="markup24" required />
				</label>
				<label class="label" for="markup"
					>*36 Month Markup
					<input type="text" class="input" value={$markup36} name="markup36" required />
				</label>
				<label class="label" for="markup"
					>*48 Month Markup
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
						*Label (e.g. "Class 8 +1000 for XYZ Dealer")
						<input type="text" class="input" name="label" value={$label} />
					</label>
					<label
						class="flex flex-col gap-2 font-semibold justify-center text-base"
						for="customLogo"
					>
						<div class="flex gap-2">
							Link to a Custom Logo <button type="button" class="flex" on:click={openInstructions}>
								<span class="flex w-4 h-4 mr-2">
									<svelte:component this={InfoCircleIcon} />
								</span>
							</button>
						</div>
						<input class="input" type="text" name="customLogo" bind:value={$customLogo} />
					</label>
					<button class="btn variant-filled-primary">Generate</button>
				</div>
			</div>
		</form>
		<div class="w-full mt-8 flex justify-center items-center">
			<div class="w-2/5">
				<img class="block dark:hidden w-full" src={JustDriveIcon} alt="ts-logo" />
				<img class="hidden dark:block w-full" src={JustDriveIconDark} alt="ts-logo" />
			</div>
		</div>
	</div>
</div>
