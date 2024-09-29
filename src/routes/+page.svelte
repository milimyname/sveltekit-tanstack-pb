<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';

	// This data is cached by prefetchQuery in +page.ts so no fetch actually happens here
	const query = createQuery({
		queryKey: ['posts'],
		queryFn: async () => (await fetch('/api/posts')).json()
	});
</script>

<div>
	{#if $query.isLoading}
		<p>Loading...</p>
	{:else if $query.isError}
		<p>Error: {$query.error.message}</p>
	{:else if $query.isSuccess}
		{#each $query.data as post}
			<p>{post.title}</p>
		{/each}
	{/if}
</div>
