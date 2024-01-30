<script lang="ts">
	import { page } from '$app/stores';
	import { AppBar, LightSwitch } from '@skeletonlabs/skeleton';
	import TsLogo from '$lib/assets/images/ts-logo.svg';
	import TsLogoDark from '$lib/assets/images/ts-logo-dark.svg';
	import SignedIn from 'clerk-sveltekit/client/SignedIn.svelte';
	import UserButton from 'clerk-sveltekit/client/UserButton.svelte';
</script>

<AppBar shadow="shadow-md">
	<svelte:fragment slot="lead">
		<div class="flex items-end gap-4">
			<a class="w-[200px]" href="/admin">
				<img class="block dark:hidden" src={TsLogo} alt="ts-logo" />
				<img class="hidden dark:block" src={TsLogoDark} alt="ts-logo-dark" />
			</a>
			<h4 class="h4">Rates Tool</h4>
		</div>
	</svelte:fragment>
	<svelte:fragment slot="trail">
		<LightSwitch />
		<nav class="list-nav">
			<ul class="flex gap-4 items-center">
				<li class="flex gap-2">
					<SignedIn>
						<UserButton afterSignOutUrl="/admin" />
					</SignedIn>
				</li>
			</ul>
		</nav>
	</svelte:fragment>
</AppBar>
