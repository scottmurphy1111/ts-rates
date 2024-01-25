import { client } from '$lib/server/prisma';
import { type RequestHandler, json } from '@sveltejs/kit';

export const DELETE: RequestHandler = async ({ url }) => {
	const id = url.searchParams.get('id');
	const ratesheetId = url.searchParams.get('ratesheetId');

	await client.row.delete({
		where: {
			id: id as string
		}
	});

	const updatedRatesheet = await client.ratesheet.findUnique({
		where: {
			id: ratesheetId as string
		},
		include: {
			rows: true,
			options: true,
			disclosuresSet: true,
			coveragesSet: true
		}
	});

	return json(updatedRatesheet);
};
