<script lang="ts">
	import { dev } from '$app/environment';
	import { goto, invalidate, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { pocketbase } from '$lib/pocketbase';
	import { createMutation } from '@tanstack/svelte-query';

	export let data;

	let username: string;
	let password: string;
	let message = $page.url.searchParams.get('message');

	const loginMutation = createMutation({
		mutationFn: async ({ username, password }: any) => {
			return await pocketbase.collection('users').authWithPassword(username, password);
		},
		onSuccess: async () => {
			username = '';
			password = '';
			await invalidateAll();
			setTimeout(() => goto('/?message="logged in successfully"'), 100);
		},
		onError: (error: any) => {
			dev && console.error('(dev) /login: ', error.message);
			message = error.message;
		}
	});

	function handleLogin() {
		$loginMutation.mutate({ username, password });
	}
</script>

{#if data.user}
	<h2>You are already logged in</h2>
{:else}
	<form on:submit|preventDefault={handleLogin}>
		<h2>Login to Pocketbase</h2>
		<label for="username">
			Username or Email
			<input autocomplete="on" bind:value={username} id="username" name="username" type="text" />
		</label>
		<label for="password">
			Password
			<input
				autocomplete="on"
				bind:value={password}
				id="password"
				name="password"
				type="password"
			/>
		</label>
		<button type="submit" disabled={$loginMutation.isLoading}>
			{$loginMutation.isLoading ? 'Logging in...' : 'Login'}
		</button>

		{#if message}
			<div id="error">
				<span>{message}</span>
			</div>
		{/if}
	</form>
{/if}

<style>
	form {
		display: flex;
		flex-direction: column;
		margin: auto;
		width: 32ch;
		gap: 1rem;
	}
	input {
		margin-top: 0.5rem;
		width: 100%;
	}
	#error {
		outline: 2px dashed;
		padding: 0.5rem;
		font-style: italic;
		color: crimson;
	}
</style>
