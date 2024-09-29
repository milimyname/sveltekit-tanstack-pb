<script lang="ts">
	import { dev } from '$app/environment';
	import { goto, invalidateAll } from '$app/navigation';
	import { pocketbase } from '$lib/pocketbase';
	import { createMutation } from '@tanstack/svelte-query';
	import { _userSchema } from './+page';
	import { superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';

	export let data;

	const { form, errors, constraints, enhance } = superForm(data.form, {
		SPA: true,
		validators: zod(_userSchema),
		onUpdate({ form }) {
			$loginMutation.mutate({ username: form.data.emailOrUsername, password: form.data.password });
		}
	});

	const loginMutation = createMutation({
		mutationFn: async ({ username, password }: any) => {
			return await pocketbase.collection('users').authWithPassword(username, password);
		},
		onSuccess: async () => {
			await invalidateAll();
			setTimeout(() => goto('/'), 100);
		},
		onError: (error: any) => {
			dev && console.error('(dev) /login: ', error.message);
		}
	});
</script>

{#if data.user}
	<h2>You are already logged in</h2>
{:else}
	<form method="POST" use:enhance>
		<label>
			Email or Username<br />
			<input
				aria-invalid={$errors.emailOrUsername ? 'true' : undefined}
				bind:value={$form.emailOrUsername}
				{...$constraints.emailOrUsername}
			/>
		</label>
		{#if $errors.emailOrUsername}<span class="invalid">{$errors.emailOrUsername}</span>{/if}

		<label>
			E-mail<br />
			<input
				type="password"
				aria-invalid={$errors.password ? 'true' : undefined}
				bind:value={$form.password}
				{...$constraints.password}
			/>
		</label>
		{#if $errors.password}<span class="invalid">{$errors.password}</span>{/if}

		<button disabled={$loginMutation.isPending}>Submit</button>
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
