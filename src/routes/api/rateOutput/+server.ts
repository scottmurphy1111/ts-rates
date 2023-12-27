import { client } from '$lib/server/prisma';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const id = url.searchParams.get('id');

	const rateOutput = await client.rateOutput.findUnique({
		where: {
			id: id as string
		},
		include: {
			markups: true
		}
	});

	return json(rateOutput);
};
