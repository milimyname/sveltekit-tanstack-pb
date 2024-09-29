import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

export const _postSchema = z.object({
	title: z.string().min(2)
});

export type PostSchema = z.infer<typeof _postSchema>;

export async function load({ parent, fetch }) {
	const { queryClient } = await parent();

	// You need to use the SvelteKit fetch function here
	await queryClient.prefetchQuery({
		queryKey: ['posts'],
		queryFn: async () => (await fetch('/api/posts')).json()
	});

	const form = await superValidate(zod(_postSchema));

	return { form };
}
