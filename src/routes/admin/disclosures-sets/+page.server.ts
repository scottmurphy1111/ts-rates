import type { PageServerLoad } from './$types';
import { client } from '$lib/server/prisma';
import type { DisclosuresSetWithIncludes } from '$lib/types/types';

export const load: PageServerLoad = async ({ depends }) => {
	depends('data:disclosuresSets');
	const disclosuresSets = await client.disclosuresSet.findMany({
		include: {
			disclosures: true
		}
	});
	return {
		disclosuresSets: disclosuresSets as DisclosuresSetWithIncludes[]
	};
};
