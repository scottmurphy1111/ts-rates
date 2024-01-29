<script lang="ts">
	import { browser } from '$app/environment';
	import ClerkLoaded from 'clerk-sveltekit/client/ClerkLoaded.svelte';
	import ClerkLoading from 'clerk-sveltekit/client/ClerkLoading.svelte';
	import SignInButton from 'clerk-sveltekit/client/SignInButton.svelte';
	import SignUpButton from 'clerk-sveltekit/client/SignUpButton.svelte';
	import SignedOut from 'clerk-sveltekit/client/SignedOut.svelte';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import SignUp from 'clerk-sveltekit/client/SignUp.svelte';
	import SignIn from 'clerk-sveltekit/client/SignIn.svelte';
	import { format } from 'date-fns';
	import CopyButton from '$lib/components/CopyButton.svelte';
	import { appHost } from '$lib/helpers/helpers';

	export let data: PageData;
	$: ({ rateOutput } = data);
</script>

{#if data.userData}
	<div class="flex flex-col p-8">
		<h2 class="h2 mb-4">Admin</h2>
		<div class="w-full flex flex-col md:flex-row">
			<div class="w-full md:w-1/2 flex gap-4 flex-wrap">
				<a
					class="card card-hover shadow-md p-8 flex flex-col gap-4 w-full md:max-w-screen-md h-min"
					href="/generator"
					><header>
						<h3 class="flex gap-2 h3 items-center">Generator</h3>
					</header>
					<section></section>
					<footer>
						<button class="btn bg-gradient-to-br variant-gradient-primary-secondary">Launch</button>
					</footer></a
				>
				{#if data.userData?.publicMetadata?.ts_role === 'admin'}
					<a
						class="card card-hover shadow-md p-8 flex flex-col gap-4 w-full md:max-w-screen-md h-min"
						href="/admin/ratesheets"
						><header>
							<h3 class="flex gap-2 h3 items-center">Ratesheets</h3>
						</header>
						<section></section>
						<footer>
							<button class="btn bg-gradient-to-br variant-gradient-primary-secondary"
								>Launch</button
							>
						</footer></a
					>
					<a
						class="card card-hover shadow-md p-8 flex flex-col gap-4 w-full md:max-w-screen-md h-min"
						href="/admin/disclosures-sets"
						><header>
							<h3 class="flex gap-2 h3 items-center">Disclosures Sets</h3>
						</header>
						<section></section>
						<footer>
							<button class="btn bg-gradient-to-br variant-gradient-primary-secondary"
								>Launch</button
							>
						</footer></a
					>
					<a
						class="card card-hover shadow-md p-8 flex flex-col gap-4 w-full md:max-w-screen-md h-min"
						href="/admin/coverages-sets"
						><header>
							<h3 class="flex gap-2 h3 items-center">Coverages Sets</h3>
						</header>
						<section></section>
						<footer>
							<button class="btn bg-gradient-to-br variant-gradient-primary-secondary"
								>Launch</button
							>
						</footer></a
					>
				{/if}
			</div>
			<div class="flex flex-col w-full md:w-1/2 gap-4 p-4">
				<p class="italic text-sm">Previous Output</p>
				<div class="grid grid-cols-2 gap-4 place-content-center">
					<span class="font-semibold">Link</span>

					<span class="font-semibold">Created</span>
					{#each rateOutput as output}
						<a class="text-primary-500" href={`/output?id=${output.id}`}>
							{output.label ? output.label : 'No Label'}
						</a>
						<div class="flex gap-2 justify-between items-center">
							<span>{format(output.createdAt, 'MM/dd/yyyy - hh:mm:ss a')}</span>
							<CopyButton copyData={`${appHost}/output?id=${output.id}`} />
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
{:else}
	<div class="flex flex-col">
		<div class="flex gap-4 justify-center items-center">
			<SignedOut>
				<SignIn />
			</SignedOut>
		</div>
	</div>
{/if}
