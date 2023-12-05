<script lang="ts">
	import { Modal, Toast } from '@skeletonlabs/skeleton';
	import '../app.postcss';

	import { initializeStores } from '@skeletonlabs/skeleton';

	initializeStores();
</script>

<Toast />
<Modal />
<slot />
