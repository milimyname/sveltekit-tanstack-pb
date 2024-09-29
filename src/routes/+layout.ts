import { browser } from '$app/environment';
import { pocketbase } from '$lib/pocketbase';
import { QueryClient } from '@tanstack/svelte-query';

export async function load() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser,
				gcTime: Infinity
			}
		}
	});

	return { queryClient, user: pocketbase.authStore.model };
}
