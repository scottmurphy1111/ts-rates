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

export const DELETE: RequestHandler = async ({ url }) => {
	const id = url.searchParams.get('id');

	const deleteMarkups = client.markup.deleteMany({
		where: {
			rateOutputId: id as string
		}
	});

	const rateOutput = client.rateOutput.delete({
		where: {
			id: id as string
		}
	});

	await client.$transaction([deleteMarkups, rateOutput]);

	return json({ message: '👍 Rate Output deleted successfully' });
};
