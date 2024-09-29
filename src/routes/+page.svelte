<script lang="ts">
	import { pocketbase } from '$lib/pocketbase';
	import { createQuery, useQueryClient } from '@tanstack/svelte-query';
	import { createMutation } from '@tanstack/svelte-query';
	import { Dialog } from 'bits-ui';
	import { superForm } from 'sveltekit-superforms';
	import { _postSchema, type PostSchema } from './+page';
	import { zod } from 'sveltekit-superforms/adapters';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	export let data;

	let dialogOpen = false;
	let isOnline = browser ? navigator.onLine : true;

	const queryClient = useQueryClient();

	// This data is cached by prefetchQuery in +page.ts so no fetch actually happens here
	const query = createQuery({
		queryKey: ['posts'],
		queryFn: async () => {
			if (!isOnline) return queryClient.getQueryData(['posts']);

			return await fetch('/api/posts').then((res) => res.json());
		},
		initialData: () => queryClient.getQueryData(['posts'])
	});

	onMount(() => {
		isOnline = navigator.onLine;
		window.addEventListener('online', () => {
			isOnline = true;
			queryClient.resumePausedMutations();
		});
		window.addEventListener('offline', () => (isOnline = false));
	});

	const { form, errors, enhance, reset } = superForm(data.form, {
		SPA: true,
		validators: zod(_postSchema),
		async onUpdate({ form }) {
			if (form.valid) {
				$postMutation.mutate({ title: form.data.title });
				dialogOpen = false;
				reset();
			}
		}
	});

	const postMutation = createMutation({
		mutationFn: async ({ title }: PostSchema) => {
			if (!isOnline) throw new Error('Offline');

			return await pocketbase.collection('posts').create({ title });
		},
		onMutate: async (newPost) => {
			// Cancel any outgoing refetches (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries({ queryKey: ['posts'] });

			// Snapshot the previous value
			const previousPosts = queryClient.getQueryData(['posts']);

			// Optimistically update to the new value
			queryClient.setQueryData(['posts'], (old: any) => {
				return [...old, { id: Math.random().toString(36).substring(7), title: newPost.title }];
			});

			// Return a context object with the snapshotted value
			return { previousPosts };
		},
		onSuccess: (newPost, variables, context) => {
			// Update the query data with the actual new post from the server
			queryClient.setQueryData(['posts'], (old: any[]) => {
				const filteredOld = old.filter((post) => post.id !== newPost.id);
				return [...filteredOld, newPost];
			});
		},
		onError: (err, newPost, context) => {
			// If the mutation fails, use the context returned from onMutate to roll back
			if (context) queryClient.setQueryData(['posts'], context.previousPosts);
		},
		onSettled: () => {
			// Always refetch after error or success:
			queryClient.invalidateQueries({ queryKey: ['posts'] });
		}
	});
</script>

<p>Network status: {isOnline ? 'Online' : 'Offline'}</p>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Trigger />
	<Dialog.Portal>
		<Dialog.Overlay />
		<Dialog.Content class="bg-blue-200 p-10">
			<Dialog.Title>Create post</Dialog.Title>
			<form use:enhance method="POST">
				<input type="text" bind:value={$form.title} />
				{#if $errors.title}<span class="invalid">{$errors.title}</span>{/if}
				<button type="submit">Submit</button>
			</form>
			<Dialog.Close />
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>

<div>
	{#if $query.isLoading}
		<p>Loading...</p>
	{:else if $query.isError}
		<p>Error: {$query.error.message}</p>
	{:else if $query.isSuccess}
		<div>
			<button on:click={() => (dialogOpen = true)}>Create post</button>
			{#each $query.data as post}
				<p>{post.title}</p>
			{/each}
		</div>
	{/if}
</div>
