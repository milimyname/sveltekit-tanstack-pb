import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

export const _userSchema = z.object({
	emailOrUsername: z.string().min(2),
	password: z.string().email()
});

export const load = async ({ parent }) => {
	const { user } = await parent();

	// redirect if user is already logged in with status code 200
	if (user) redirect(302, '/');

	const form = await superValidate(zod(_userSchema));

	return { form };
};
