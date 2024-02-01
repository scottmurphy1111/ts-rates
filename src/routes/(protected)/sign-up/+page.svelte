<script lang="ts">
	import SignUp from 'clerk-sveltekit/client/SignUp.svelte';
</script>

<div class="flex items-center justify-center h-full">
	<SignUp redirectUrl="/sign-in" />
</div>
