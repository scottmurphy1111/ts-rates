<script lang="ts">
	import { page } from '$app/stores';
	import TsLogo from '$lib/assets/images/ts-logo.svg';
	import TsLogoDark from '$lib/assets/images/ts-logo-dark.svg';
	import { AppShell, AppBar, LightSwitch } from '@skeletonlabs/skeleton';

	const href = $page.url.pathname;

	// $: console.log('href', href);
	$: classesActive = (href: string) =>
		href === $page.url.pathname
			? 'variant-filled-primary dark:variant-ghost-primary text-white rounded-lg'
			: '';

	let currentYear = new Date().getFullYear();
</script>

<AppShell>
	<svelte:fragment slot="header">
		<AppBar>
			<svelte:fragment slot="lead">
				<a class="w-[200px]" href="/admin">
					<img class="block dark:hidden" src={TsLogo} alt="ts-logo" />
					<img class="hidden dark:block" src={TsLogoDark} alt="ts-logo-dark" />
				</a>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<LightSwitch />
				<nav class="list-nav">
					<ul class="flex gap-4 items-center">
						<li class={classesActive('/admin/ratesheets')}>
							<a href="/admin/ratesheets">Ratesheets</a>
						</li>
						<li class={classesActive('/admin/disclosures')}>
							<a href="/admin/disclosures">Disclosures</a>
						</li>
						<li class={classesActive('/admin/coverages')}>
							<a href="/admin/coverages">Coverages</a>
						</li>
					</ul>
				</nav>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<slot />
	<svelte:fragment slot="pageFooter"
		>©️{currentYear} TruckSuite, LLC - All Rights Reserved
	</svelte:fragment>
</AppShell>
<!-- <header
	class="flex justify-between bg-black bg-opacity-10 p-4 items-center border-b border-b-black border-opacity-20 drop-shadow-md"
>
	<a class="w-[200px]" href="/admin"><img src={TsLogo} alt="Ts Logo" /></a>
	<ul class="flex gap-4 items-center">
		<li class="hover:text-ts-blue transition-colors">
			<a href="/admin/ratesheets">Ratesheets</a>
		</li>
		<li class="hover:text-ts-blue transition-colors">
			<a href="/admin/disclosures">Disclosures</a>
		</li>
		<li class="hover:text-ts-blue transition-colors">
			<a href="/admin/coverages">Coverages</a>
		</li>
	</ul>
</header> -->
