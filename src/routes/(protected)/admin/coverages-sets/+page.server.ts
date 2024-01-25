import { client } from '$lib/server/prisma';
import type { CoveragesSetWithIncludes } from '$lib/types/types';
import type { Actions } from '@sveltejs/kit';

export const load = async ({ depends }) => {
	depends('data:coveragesSets');
	const coveragesSets = await client.coveragesSet.findMany({
		include: {
			coverages: true
		}
	});
	return {
		coveragesSets: coveragesSets as CoveragesSetWithIncludes[]
	};
};

export const actions: Actions = {
	selectCoveragesSet: async ({ request }) => {
		const formData = await request.formData();

		const selectedCoveragesSetId = formData.get('selectedCoveragesSetId');

		const coveragesSet = await client.coveragesSet.findUnique({
			where: {
				id: selectedCoveragesSetId as string
			},
			include: {
				coverages: true
			}
		});

		return {
			coveragesSet: coveragesSet as CoveragesSetWithIncludes
		};
	}
};
