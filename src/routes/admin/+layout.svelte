<script lang="ts">
	import { page } from '$app/stores';
	import TsLogo from '$lib/assets/images/ts-logo.svg';
	import TsLogoDark from '$lib/assets/images/ts-logo-dark.svg';
	import { AppShell, AppBar, LightSwitch } from '@skeletonlabs/skeleton';

	$: classesActive = (href: string) =>
		href === $page.url.pathname
			? 'bg-gradient-to-br variant-gradient-primary-secondary text-white rounded-lg'
			: '';

	let currentYear = new Date().getFullYear();
</script>

<AppShell>
	<svelte:fragment slot="header">
		<AppBar>
			<svelte:fragment slot="lead">
				<a class="w-[200px]" href="/">
					<img class="block dark:hidden" src={TsLogo} alt="ts-logo" />
					<img class="hidden dark:block" src={TsLogoDark} alt="ts-logo-dark" />
				</a>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<LightSwitch />
				<nav class="list-nav">
					<ul class="flex gap-4 items-center">
						<li class={classesActive('/admin')}>
							<a href="/admin">Admin</a>
						</li>
						<li class={classesActive('/admin/ratesheets')}>
							<a href="/admin/ratesheets">Ratesheets</a>
						</li>
						<li class={classesActive('/admin/disclosures-sets')}>
							<a href="/admin/disclosures-sets">Disclosures Sets</a>
						</li>
						<li class={classesActive('/admin/coverages-sets')}>
							<a href="/admin/coverages-sets">Coverages Sets</a>
						</li>
					</ul>
				</nav>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<slot />
	<svelte:fragment slot="pageFooter"
		><div class="flex justify-center p-4 bg-surface-100-800-token">
			©️{currentYear} TruckSuite, LLC - All Rights Reserved
		</div>
	</svelte:fragment>
</AppShell>
