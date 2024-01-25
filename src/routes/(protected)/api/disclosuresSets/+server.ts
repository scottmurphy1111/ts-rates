import { client } from '$lib/server/prisma';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const id = url.searchParams.get('id');

	const disclosuresSet = await client.disclosuresSet.findUnique({
		where: {
			id: id as string
		},
		include: {
			disclosures: true
		}
	});

	return json(disclosuresSet);
};

export const DELETE: RequestHandler = async ({ url }) => {
	const id = url.searchParams.get('id');

	const deleteDisclosures = client.disclosure.deleteMany({
		where: {
			disclosuresSetId: id as string
		}
	});

	const deleteDisclosuresSet = client.disclosuresSet.delete({
		where: {
			id: id as string
		}
	});

	await client.$transaction([deleteDisclosures, deleteDisclosuresSet]);

	return json({ message: '👍 Disclosures Set deleted successfully' });
};
