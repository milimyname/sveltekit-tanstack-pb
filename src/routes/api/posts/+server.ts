import { json } from '@sveltejs/kit';

export function GET() {
	const posts = [
		{
			title: 'Post 1',
			content: 'This is the first post.'
		},
		{
			title: 'Post 2',
			content: "This is the's second post."
		}
	];
	return json(posts);
}
