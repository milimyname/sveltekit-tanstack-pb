import { pocketbase } from '$lib/pocketbase';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	// Load the auth store from local storage
	pocketbase.authStore.loadFromCookie(document.cookie);

	// Refresh the auth if needed
	if (pocketbase.authStore.isValid) {
		try {
			await pocketbase.collection('users').authRefresh();
		} catch {
			pocketbase.authStore.clear();
		}
	}

	// Save the auth store to a cookie
	document.cookie = pocketbase.authStore.exportToCookie({ httpOnly: false });

	return resolve(event);
}
