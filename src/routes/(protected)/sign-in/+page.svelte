<script lang="ts">
	import SignedIn from 'clerk-sveltekit/client/SignedIn.svelte';
	import SpinnerIcon from '$lib/assets/icons/spinner.svelte';
	import SignIn from 'clerk-sveltekit/client/SignIn.svelte';
</script>

<div class="flex flex-col gap-4 items-center justify-center h-full">
	<h2 class="h2">Welcome to TS Ratesheet Tool</h2>
	<SignIn redirectUrl="/dashboard" />
	<SignedIn>
		<div class="flex fixed w-screen h-screen top-0 justify-center items-center z-20">
			<div class="w-8 z-10 relative">
				<svelte:component this={SpinnerIcon} />
			</div>
			<div class="bg-surface-500 opacity-50 w-full h-full absolute top-0 left-0"></div>
		</div>
	</SignedIn>
</div>
