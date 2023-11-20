<script lang="ts">
	export let label: string;
	export let placeholder: string | undefined;
	export let name: string;
	export let value: string;
</script>

<label class="flex flex-col gap-1 font-semibold text-base"
	>{label}
	<input
		type="text"
		class="border border-ts-gray-md rounded py-3 px-4"
		{name}
		{placeholder}
		bind:value
	/>
</label>
