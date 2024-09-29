import { goto, invalidateAll } from '$app/navigation';
import { pocketbase } from './pocketbase';

export async function logout() {
	pocketbase.authStore.clear();
	await invalidateAll();
	goto('/login/?message="logged out"');
}
