import { client } from '$lib/server/prisma';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const id = url.searchParams.get('id');

	const ratesheet = await client.ratesheet.findUnique({
		where: {
			id: id as string
		},
		include: {
			rows: true,
			options: true,
			disclosuresSet: {
				include: {
					disclosures: true
				}
			},
			coveragesSet: {
				include: {
					coverages: true
				}
			}
		}
	});

	return json(ratesheet);
};

export const DELETE: RequestHandler = async ({ url }) => {
	const id = url.searchParams.get('id');

	const deleteRows = client.row.deleteMany({
		where: {
			ratesheetId: id as string
		}
	});

	const deleteOptions = client.option.deleteMany({
		where: {
			ratesheetId: id as string
		}
	});

	const deleteRatesheet = client.ratesheet.delete({
		where: {
			id: id as string
		}
	});

	await client.$transaction([deleteRows, deleteOptions, deleteRatesheet]);

	return json({ message: '👍 Ratesheet deleted successfully' });
};
