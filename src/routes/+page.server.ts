import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
// import path from 'path';
// import { writeFileSync } from 'fs';
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

		console.log('data', data);
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

		// if (!cardTypes || !markup) {
		// 	return fail(400, { err: 'Cannot create Rate Card Template' });
		// }
		// cookies.set('cardTypes', JSON.stringify(cardTypes), { maxAge: 24 * 60 * 60 });
		// cookies.set('markup', JSON.stringify(markup), { maxAge: 24 * 60 * 60 });

		// if ((customLogo as File).size) {
		// 	const file = data.get('customLogo') as File;
		// 	const imageResource = `customLogos/${crypto.randomUUID()}.${file.type.split('/')[1]}`;
		// 	const filePath = path.join(process.cwd(), 'static', imageResource);

		// 	writeFileSync(filePath, Buffer.from(await file.arrayBuffer()));
		// 	cookies.set('customLogo', imageResource, { maxAge: 24 * 60 * 60 });
		// } else {
		// 	cookies.set('customLogo', '', { maxAge: -1 });
		// }

		throw redirect(302, `/output?id=${rateOutput.id}`);
	}
} satisfies Actions;
