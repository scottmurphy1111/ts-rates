<script lang="ts">
	import { page } from '$app/stores';
	import { AppBar, LightSwitch } from '@skeletonlabs/skeleton';
	import TsLogo from '$lib/assets/images/ts-logo.svg';
	import TsLogoDark from '$lib/assets/images/ts-logo-dark.svg';
	import GreedIcon from '$lib/assets/icons/greed.svelte';
	import SignedIn from 'clerk-sveltekit/client/SignedIn.svelte';
	import UserButton from 'clerk-sveltekit/client/UserButton.svelte';
</script>

<AppBar shadow="shadow-md">
	<svelte:fragment slot="lead">
		<div class="flex items-center gap-4">
			<a class="w-[200px]" href="/dashboard">
				<img class="block dark:hidden" src={TsLogo} alt="ts-logo" />
				<img class="hidden dark:block" src={TsLogoDark} alt="ts-logo-dark" />
			</a>
			<h4
				class="h4 text-primary-500 font-semibold flex gap-2 item-center text-base bg-white rounded-2xl px-4 py-1 overflow-hidden shadow"
			>
				<span class="self-center">Ratesheet Tool</span>
				<span class="text-lg self-center w-4 h-4">
					<svelte:component this={GreedIcon} />
				</span>
			</h4>
		</div>
	</svelte:fragment>
	<svelte:fragment slot="trail">
		<LightSwitch />
		<nav class="list-nav">
			<ul class="flex gap-4 items-center">
				<li class="flex gap-2">
					<SignedIn>
						<UserButton afterSignOutUrl="/dashboard" />
					</SignedIn>
				</li>
			</ul>
		</nav>
	</svelte:fragment>
</AppBar>
