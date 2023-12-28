import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { client } from '$lib/server/prisma';
import type { RatesheetWithIncludes } from '$lib/types/types';
import type { RateOutput } from '@prisma/client';

export const load: PageServerLoad = async ({ url }) => {
	const rateOutputId = url.searchParams.get('id');

	if (!rateOutputId) {
		return fail(400, { err: 'Cannot create Rate Card Template' });
	}

	const rateOutputData = await client.rateOutput.findUnique({
		where: {
			id: rateOutputId
		},
		include: {
			markups: true
		}
	});

	const ratesheet = await client.ratesheet.findUnique({
		where: {
			id: rateOutputData?.ratesheetId
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

	return {
		output: rateOutputData as RateOutput,
		ratesheet: ratesheet as RatesheetWithIncludes
	};
};
