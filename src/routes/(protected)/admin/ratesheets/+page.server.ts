import type { PageServerLoad } from './$types';
import { client } from '$lib/server/prisma';
import type {
	CoveragesSetWithIncludes,
	DisclosuresSetWithIncludes,
	RatesheetWithIncludes
} from '$lib/types/types';

export const load: PageServerLoad = async ({ depends }) => {
	depends('data:ratesheets');
	let ratesheets = await client.ratesheet.findMany({
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
	const disclosuresSets = await client.disclosuresSet.findMany({
		include: {
			disclosures: true
		}
	});
	const coveragesSets = await client.coveragesSet.findMany({
		include: {
			coverages: true
		}
	});

	ratesheets = ratesheets.sort((a, b) => {
		return a.name.localeCompare(b.name);
	});

	return {
		ratesheets: ratesheets as RatesheetWithIncludes[],
		disclosuresSets: disclosuresSets as DisclosuresSetWithIncludes[],
		coveragesSets: coveragesSets as CoveragesSetWithIncludes[]
	};
};
