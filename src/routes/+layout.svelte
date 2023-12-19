<script lang="ts">
	import { AppShell, Modal, Toast } from '@skeletonlabs/skeleton';
	import '../app.postcss';
	import SpinnerIcon from '$lib/assets/icons/spinner.svelte';
	import { initializeStores } from '@skeletonlabs/skeleton';
	import { writable } from 'svelte/store';
	import { setContext } from 'svelte';

	const pendingStore = writable<boolean>(false);
	setContext('pendingStore', pendingStore);

	initializeStores();
</script>

{#if $pendingStore}
	<div class="flex absolute w-screen h-screen top-0 justify-center items-center z-20">
		<div class="w-8 z-10 relative">
			<svelte:component this={SpinnerIcon} />
		</div>
		<div class="bg-surface-500 opacity-50 w-full h-full absolute top-0 left-0"></div>
	</div>
{/if}
<Toast />
<Modal />
<AppShell>
	<slot />
</AppShell>
