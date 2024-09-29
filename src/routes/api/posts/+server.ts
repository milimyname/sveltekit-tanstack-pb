import { pocketbase } from '$lib/pocketbase';
import { json } from '@sveltejs/kit';

export async function GET() {
	const posts = await pocketbase.collection('posts').getList(1, 10, {
		fields: 'title,content',
		sort: '-created'
	});

	return json(posts.items);
}
