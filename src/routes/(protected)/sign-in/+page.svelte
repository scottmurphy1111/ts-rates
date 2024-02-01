<script lang="ts">
	import SignIn from 'clerk-sveltekit/client/SignIn.svelte';
</script>

<div class="flex items-center justify-center h-full">
	<SignIn redirectUrl="/dashboard" />
</div>
