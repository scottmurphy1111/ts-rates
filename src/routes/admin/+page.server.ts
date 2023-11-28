import type { PageServerLoad } from './$types';
import type { Actions } from './$types';
import { client } from '$lib/server/prisma';
import type { RatesheetsWithIncludes } from '$lib/types/types';

export const load: PageServerLoad = async () => {
	const ratesheets = await client.ratesheet.findMany({
		include: {
			rows: true,
			options: {
				include: {
					details: true
				}
			},
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
		// console.log(`triggered =  `, request);

		const formData = await request.formData();

		// console.log('formData', formData);

		const selectedRatesheet = formData.get('selectedRatesheet');

		// console.log('selectedRatesheet', selectedRatesheet);

		// const res = await fetch(`/api/rate-sheets?name=${selectedRatesheet}`);
		// const ratesheet = await res.json();

		const ratesheet = await client.ratesheet.findUnique({
			where: {
				name: selectedRatesheet
			},
			include: {
				rows: true,
				options: {
					include: {
						details: true
					}
				},
				disclosures: true,
				coverages: true
			}
		});

		// console.log('ratesheet', ratesheet);

		return {
			ratesheet: ratesheet as RatesheetsWithIncludes
		};
	},

	updateRatesheet: async ({ request }) => {
		const formData = await request.formData();

		console.log('formData 🥶', formData);

		const id = formData.get('id');
		const name = formData.get('name');
		const title = formData.get('title');
		// const termValues = formData.getAll('termValue');
		// const termUnits = formData.getAll('termUnit');
		// const mileageValues = formData.getAll('mileageValue');
		// const costNewerLowMiles = formData.getAll('costNewerLowMiles');
		// const costNewerHighMiles = formData.getAll('costNewerHighMiles');
		// const costOlderLowMiles = formData.getAll('costOlderLowMiles');
		// const costOlderHighMiles = formData.getAll('costOlderHighMiles');
		// const deductibles = formData.getAll('deductible');
		// const aggregateLimits = formData.getAll('aggregateLimit');
		// const optionPackages = formData.getAll('optionPackage');
		// const optionTermValues = formData.getAll('optionTermValue');
		// const optionTermUnits = formData.getAll('optionTermUnit');
		// const optionCosts = formData.getAll('optionCost');
		// const disclosureTitles = formData.getAll('disclosureTitle');
		// const disclosureDescriptions = formData.getAll('disclosureDescription');
		// const coverageTitles = formData.getAll('coverageTitle');
		// const coverageDescriptions = formData.getAll('coverageDescription');

		const formattedName = title?.toString().toLowerCase().replace(/\s/g, '_');

		console.log('alll data', [
			name,
			title
			// termValues,
			// termUnits,
			// mileageValues,
			// costNewerLowMiles,
			// costNewerHighMiles,
			// costOlderLowMiles,
			// costOlderHighMiles,
			// deductibles,
			// aggregateLimits,
			// optionPackages,
			// optionTermValues,
			// optionTermUnits,
			// optionCosts,
			// disclosureTitles,
			// disclosureDescriptions,
			// coverageTitles,
			// coverageDescriptions
		]);

		const updatedRatesheet = await client.ratesheet.update({
			where: {
				id: id as string
			},
			data: {
				name: formattedName as string,
				title: title as string
			},
			include: {
				rows: true,
				options: {
					include: {
						details: true
					}
				},
				disclosures: true,
				coverages: true
			}
		});

		return {
			ratesheet: updatedRatesheet as RatesheetsWithIncludes
		};
		// const selectedRatesheet = formData.get('selectedRatesheet');

		// console.log('selectedRatesheet', selectedRatesheet);

		// // const res = await fetch(`/api/rate-sheets?name=${selectedRatesheet}`);
		// // const ratesheet = await res.json();

		// const ratesheet = await client.ratesheet.findFirst({
		//   where: {
		//     name: selectedRatesheet
		//   },
		//   include: {
		//     rows: true,
		//     options: {
		//       include: {
		//         details: true
		//       }
		//     },
		//     disclosures: true,
		//     coverages: true
		//   }
		// });

		// console.log('ratesheet', ratesheet);

		// return {
		//   ratesheet: ratesheet as RatesheetsWithIncludes
		// };
	},

	updateRow: async ({ request }) => {
		const formData = await request.formData();

		console.log('formData 🥵', formData);

		const id = formData.get('id');
		const termValues = formData.get('termValue');
		const termUnits = formData.get('termUnit');
		const mileageValues = formData.get('mileageValue');
		const costNewerLowMiles = formData.get('costNewerLowMiles');
		const costNewerHighMiles = formData.get('costNewerHighMiles');
		const costOlderLowMiles = formData.get('costOlderLowMiles');
		const costOlderHighMiles = formData.get('costOlderHighMiles');
		const deductibles = formData.get('deductible');
		const aggregateLimits = formData.get('aggregateLimit');

		console.log('alll data', [
			id,
			termValues,
			termUnits,
			mileageValues,
			costNewerLowMiles,
			costNewerHighMiles,
			costOlderLowMiles,
			costOlderHighMiles,
			deductibles,
			aggregateLimits
		]);

		const updatedRow = await client.row.update({
			where: {
				id: id as string
			},
			data: {
				termValue: termValues as string,
				termUnit: termUnits as string,
				mileageValue: mileageValues as string,
				costNewerLowMiles: costNewerLowMiles as string,
				costNewerHighMiles: costNewerHighMiles as string,
				costOlderLowMiles: costOlderLowMiles as string,
				costOlderHighMiles: costOlderHighMiles as string,
				deductible: deductibles as string,
				aggregateLimit: aggregateLimits as string
			}
			// include: {
			// 	rows: true,
			// 	options: {
			// 		include: {
			// 			details: true
			// 		}
			// 	},
			// 	disclosures: true,
			// 	coverages: true
			// }
		});

		const updatedRatesheet = await client.ratesheet.findUnique({
			where: {
				id: updatedRow.ratesheetId
			},
			include: {
				rows: true,
				options: {
					include: {
						details: true
					}
				},
				disclosures: true,
				coverages: true
			}
		});

		return {
			ratesheet: updatedRatesheet as RatesheetsWithIncludes
		};
	},
	createRow: async ({ request }) => {
		const formData = await request.formData();

		console.log('formData 🥵', formData);
		const ratesheetId = formData.get('ratesheetId');
		const termValues = formData.get('termValue');
		const termUnits = formData.get('termUnit');
		const mileageValues = formData.get('mileageValue');
		const costNewerLowMiles = formData.get('costNewerLowMiles');
		const costNewerHighMiles = formData.get('costNewerHighMiles');
		const costOlderLowMiles = formData.get('costOlderLowMiles');
		const costOlderHighMiles = formData.get('costOlderHighMiles');
		const deductibles = formData.get('deductible');
		const aggregateLimits = formData.get('aggregateLimit');

		console.log('alll data', [
			ratesheetId,
			termValues,
			termUnits,
			mileageValues,
			costNewerLowMiles,
			costNewerHighMiles,
			costOlderLowMiles,
			costOlderHighMiles,
			deductibles,
			aggregateLimits
		]);

		const updatedRow = await client.row.create({
			data: {
				termValue: termValues as string,
				termUnit: termUnits as string,
				mileageValue: mileageValues as string,
				costNewerLowMiles: costNewerLowMiles as string,
				costNewerHighMiles: costNewerHighMiles as string,
				costOlderLowMiles: costOlderLowMiles as string,
				costOlderHighMiles: costOlderHighMiles as string,
				deductible: deductibles as string,
				aggregateLimit: aggregateLimits as string,
				ratesheet: {
					connect: {
						id: ratesheetId as string
					}
				}
			}
			// include: {
			// 	rows: true,
			// 	options: {
			// 		include: {
			// 			details: true
			// 		}
			// 	},
			// 	disclosures: true,
			// 	coverages: true
			// }
		});

		const updatedRatesheet = await client.ratesheet.findUnique({
			where: {
				id: updatedRow.ratesheetId
			},
			include: {
				rows: true,
				options: {
					include: {
						details: true
					}
				},
				disclosures: true,
				coverages: true
			}
		});

		return {
			ratesheet: updatedRatesheet as RatesheetsWithIncludes
		};
	}
} satisfies Actions;
