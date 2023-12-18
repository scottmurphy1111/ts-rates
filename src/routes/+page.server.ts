import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import path from 'path';
import { writeFileSync } from 'fs';
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
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const cardTypes = data.getAll('cardTypes');
		const markup = data.get('markup');
		const customLogo = data.get('customLogo');

		if (!cardTypes || !markup) {
			return fail(400, { err: 'Cannot create Rate Card Template' });
		}
		cookies.set('cardTypes', JSON.stringify(cardTypes), { maxAge: 24 * 60 * 60 });
		cookies.set('markup', JSON.stringify(markup), { maxAge: 24 * 60 * 60 });

		if ((customLogo as File).size) {
			const file = data.get('customLogo') as File;
			const imageResource = `customLogos/${crypto.randomUUID()}.${file.type.split('/')[1]}`;
			const filePath = path.join(process.cwd(), 'static', imageResource);

			writeFileSync(filePath, Buffer.from(await file.arrayBuffer()));
			cookies.set('customLogo', imageResource, { maxAge: 24 * 60 * 60 });
		} else {
			cookies.set('customLogo', '', { maxAge: -1 });
		}

		throw redirect(302, '/output');
	}
} satisfies Actions;
