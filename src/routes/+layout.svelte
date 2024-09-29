<script lang="ts">
	import '../app.css';
	import type { LayoutData } from './$types';
	import { page } from '$app/stores';
	import { logout } from '$lib/auth';
	import { browser } from '$app/environment';
	import { createSyncStoragePersister } from '$lib/query/createSyncStoragePersister.ts';
	import PersistQueryClientProvider from '$lib/query/PersistQueryClientProvider.svelte';
	import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';

	export let data: LayoutData;

	const persister = browser
		? createSyncStoragePersister({
				storage: window.localStorage
			})
		: undefined;
</script>

<PersistQueryClientProvider
	client={data.queryClient}
	persistOptions={{ persister }}
	on:success={() => console.log('internet on - restored')}
>
	<nav>
		<span>
			<a href="/">Home</a> &middot;
		</span>
		{#if data.user}
			<button on:click={logout}>Logout</button>
		{:else if $page.url.pathname !== '/login'}
			<a href="/login">Login</a>
		{/if}
	</nav>
	<slot />
	<SvelteQueryDevtools />
</PersistQueryClientProvider>
