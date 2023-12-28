import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { client } from '$lib/server/prisma';
import type { RatesheetWithIncludes } from '$lib/types/types';

export const load = async () => {
	const ratesheets = await client.ratesheet.findMany({
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

	return {
		ratesheets: ratesheets as RatesheetWithIncludes[]
	};
};

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		const selectedRatesheetId = data.get('selectedRatesheetId');
		const markup12 = data.get('markup12');
		const markup24 = data.get('markup24');
		const markup36 = data.get('markup36');
		const markup48 = data.get('markup48');
		const selectedColor = data.get('selectedColor');
		const customLogo = data.get('customLogo');

		const markupsData = [
			{
				termValue: '12',
				markupValue: markup12 as string
			},
			{
				termValue: '24',
				markupValue: markup24 as string
			},
			{
				termValue: '36',
				markupValue: markup36 as string
			},
			{
				termValue: '48',
				markupValue: markup48 as string
			}
		];

		const rateOutput = await client.rateOutput.create({
			data: {
				ratesheetId: selectedRatesheetId as string,
				markups: {
					create: markupsData
				},
				color: selectedColor as string,
				logoUrl: customLogo as string
			}
		});

		throw redirect(302, `/output?id=${rateOutput.id}`);
	}
} satisfies Actions;
