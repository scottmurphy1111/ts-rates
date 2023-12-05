import { client } from '$lib/server/prisma';
import type { DisclosuresSetWithIncludes } from '$lib/types/types';
import type { Actions } from '@sveltejs/kit';

export const load = async () => {
	const disclosuresSets = await client.disclosuresSet.findMany({
		include: {
			disclosures: true
		}
	});
	return {
		disclosuresSets: disclosuresSets as DisclosuresSetWithIncludes[]
	};
};

export const actions: Actions = {
	selectDisclosuresSet: async ({ request }) => {
		const formData = await request.formData();

		const selectedDisclosuresSet = formData.get('selectedDisclosuresSet');

		const disclosuresSet = await client.disclosuresSet.findUnique({
			where: {
				id: selectedDisclosuresSet
			},
			include: {
				disclosures: true
			}
		});

		return {
			disclosuresSet: disclosuresSet as DisclosuresSetWithIncludes
		};
	}
};
