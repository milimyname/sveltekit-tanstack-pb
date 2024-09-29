// import { QueryClient } from '@tanstack/svelte-query';
// // import { persist, createSyncStoragePersister } from '@tanstack/query-core';
// import { browser } from '$app/environment';

// let queryClient: QueryClient;

// if (browser) {
// 	queryClient = new QueryClient({
// 		defaultOptions: {
// 			queries: {
// 				cacheTime: 1000 * 60 * 60 * 24, // 24 hours
// 				staleTime: 2000,
// 				retry: 0,
// 				enabled: true
// 			}
// 		}
// 	});

// 	const persister = createSyncStoragePersiste({
// 		storage: window.localStorage
// 	});

// 	persist({
// 		queryClient,
// 		persister,
// 		buster: 'your-app-cache-buster',
// 		maxAge: 1000 * 60 * 60 * 24 * 30 // 30 days
// 	});
// }

// export { queryClient };
