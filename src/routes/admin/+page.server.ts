import type { PageServerLoad } from './$types';
import type { Actions } from './$types';
import { client } from '$lib/server/prisma';
import type { RatesheetsWithIncludes } from '$lib/types/types';

export const load: PageServerLoad = async () => {
	const ratesheets = await client.ratesheet.findMany({
		include: {
			rows: true,
			disclosures: true,
			coverages: true
		}
	});

	return {
		// ratesheet: ratesheet as Ratesheet
		ratesheets: ratesheets as RatesheetsWithIncludes[]
	};
};

export const actions: Actions = {
	selectRatesheet: async ({ request }) => {
		console.log(`triggered =  `, request);

		const formData = await request.formData();

		console.log('formData', formData);

		const selectedRatesheet = formData.get('selectedRatesheet');

		console.log('selectedRatesheet', selectedRatesheet);

		// const res = await fetch(`/api/rate-sheets?name=${selectedRatesheet}`);
		// const ratesheet = await res.json();

		const ratesheet = await client.ratesheet.findFirst({
			where: {
				name: selectedRatesheet
			},
			include: {
				rows: true,
				disclosures: true,
				coverages: true
			}
		});

		console.log('ratesheet', ratesheet);

		return {
			ratesheet: ratesheet as RatesheetsWithIncludes
		};
	}
} satisfies Actions;
