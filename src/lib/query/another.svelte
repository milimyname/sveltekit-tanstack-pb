<script>
	//https://github.com/TanStack/query/discussions/5378
	import { setContext, onMount } from 'svelte';
	import { hydrate, dehydrate } from '@tanstack/svelte-query';
	import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';

	export let data;

	const queryClient = data.queryClient;
	setContext('$$_queryClient', queryClient);

	const hydrateClient = () => {
		try {
			const storeValue = localStorage.getItem('QUERY_CLIENT');
			if (!storeValue) return;

			const persistedValue = JSON.parse(storeValue);

			if (persistedValue?.timestamp) {
				const MAX_AGE = 1000 * 60 * 60 * 24;
				const expired = Date.now() - persistedValue.timestamp > MAX_AGE;
				if (!expired) hydrate(queryClient, persistedValue.clientState);
			} else {
				localStorage.removeItem('QUERY_CLIENT');
			}
		} catch {
			// remove persisted client on any error
			localStorage.removeItem('QUERY_CLIENT');
		}
	};
	const saveClient = () => {
		localStorage.setItem(
			'QUERY_CLIENT',
			JSON.stringify({
				timestamp: Date.now(),
				clientState: dehydrate(queryClient, {})
			})
		);
	};

	const unload = () => {
		saveClient();
	};

	onMount(() => {
		hydrateClient();
		queryClient.mount();
		return () => {
			queryClient.unmount();
		};
	});
</script>

<slot />
<SvelteQueryDevtools buttonPosition="bottom-right" />
<svelte:window on:beforeunload={unload} />
