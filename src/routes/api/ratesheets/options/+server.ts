import { client } from '$lib/server/prisma';
import { json, type RequestHandler } from '@sveltejs/kit';

export const DELETE: RequestHandler = async ({ url }) => {
	const id = url.searchParams.get('id');
	const ratesheetId = url.searchParams.get('ratesheetId');

	await client.option.delete({
		where: {
			id: id
		}
	});

	const updatedRatesheet = await client.ratesheet.findUnique({
		where: {
			id: ratesheetId
		},
		include: {
			rows: true,
			options: {
				include: {
					details: true
				}
			},
			disclosures: true,
			coverages: true
		}
	});

	console.log('updatedRatesheet', updatedRatesheet);

	return json(updatedRatesheet);
};
