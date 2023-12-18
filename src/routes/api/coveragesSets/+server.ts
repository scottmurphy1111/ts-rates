import { client } from '$lib/server/prisma';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const id = url.searchParams.get('id');

	const coveragesSet = await client.coveragesSet.findUnique({
		where: {
			id: id as string
		},
		include: {
			coverages: true
		}
	});

	return json(coveragesSet);
};

export const DELETE: RequestHandler = async ({ url }) => {
	const id = url.searchParams.get('id');

	const deleteCoverages = client.coverage.deleteMany({
		where: {
			coveragesSetId: id as string
		}
	});

	const deleteCoveragesSet = client.coveragesSet.delete({
		where: {
			id: id as string
		}
	});

	await client.$transaction([deleteCoverages, deleteCoveragesSet]);

	return json({ message: '👍 Coverages Set deleted successfully' });
};
