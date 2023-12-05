import type { PageServerLoad } from '../../$types';
import type { Actions } from '../../$types';
import { client } from '$lib/server/prisma';
import type { RatesheetsWithIncludes } from '$lib/types/types';

export const load: PageServerLoad = async () => {
	const ratesheets = await client.ratesheet.findMany({
		include: {
			rows: true,
			options: {
				include: {
					package: true,
					details: true
				}
			},
			disclosuresSet: {
				include: {
					disclosures: true
				}
			},
			coverages: true
		}
	});

	return {
		ratesheets: ratesheets as RatesheetsWithIncludes[]
	};
};

export const actions: Actions = {
	selectRatesheet: async ({ request }) => {
		const formData = await request.formData();

		const selectedRatesheet = formData.get('selectedRatesheet');

		const ratesheet = await client.ratesheet.findUnique({
			where: {
				name: selectedRatesheet
			},
			include: {
				rows: true,
				options: {
					include: {
						package: true,
						details: true
					}
				},
				disclosuresSet: {
					include: {
						disclosures: true
					}
				},
				coverages: true
			}
		});

		return {
			ratesheet: ratesheet as RatesheetsWithIncludes
		};
	},
	updateTitle: async ({ request }) => {
		const formData = await request.formData();

		const id = formData.get('id');
		const title = formData.get('title');
		const subtitle = formData.get('subtitle');

		const formattedName = title?.toString().toLowerCase().replace(/\s/g, '_');

		const updatedRatesheet = await client.ratesheet.update({
			where: {
				id: id as string
			},
			data: {
				name: formattedName as string,
				title: title as string,
				subtitle: subtitle as string
			},
			include: {
				rows: true,
				options: {
					include: {
						package: true,
						details: true
					}
				},
				disclosuresSet: {
					include: {
						disclosures: true
					}
				},
				coverages: true
			}
		});

		return {
			ratesheet: updatedRatesheet as RatesheetsWithIncludes
		};
	},
	updateRow: async ({ request }) => {
		const formData = await request.formData();

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
		});

		const updatedRatesheet = await client.ratesheet.findUnique({
			where: {
				id: updatedRow.ratesheetId
			},
			include: {
				rows: true,
				options: {
					include: {
						package: true,
						details: true
					}
				},
				disclosuresSet: {
					include: {
						disclosures: true
					}
				},
				coverages: true
			}
		});

		return {
			ratesheet: updatedRatesheet as RatesheetsWithIncludes
		};
	},
	createRow: async ({ request }) => {
		const formData = await request.formData();

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
		});

		const updatedRatesheet = await client.ratesheet.findUnique({
			where: {
				id: updatedRow.ratesheetId
			},
			include: {
				rows: true,
				options: {
					include: {
						package: true,
						details: true
					}
				},
				disclosuresSet: {
					include: {
						disclosures: true
					}
				},
				coverages: true
			}
		});

		return {
			ratesheet: updatedRatesheet as RatesheetsWithIncludes
		};
	},
	updateOption: async ({ request }) => {
		const formData = await request.formData();

		const id = formData.get('id');
		const optionPackage = formData.get('optionPackage');
		const optionTermValue = formData.get('optionTermValue');
		const optionTermUnit = formData.get('optionTermUnit');
		const optionCost = formData.get('optionCost');

		const updatedOption = await client.option.update({
			where: {
				id: id as string
			},
			data: {
				package: {
					update: {
						name: optionPackage as string
					}
				},
				details: {
					update: {
						termValue: optionTermValue as string,
						termUnit: optionTermUnit as string,
						cost: optionCost as string
					}
				}
			}
		});

		const updatedRatesheet = await client.ratesheet.findUnique({
			where: {
				id: updatedOption.ratesheetId
			},
			include: {
				rows: true,
				options: {
					include: {
						package: true,
						details: true
					}
				},
				disclosuresSet: {
					include: {
						disclosures: true
					}
				},
				coverages: true
			}
		});

		return {
			ratesheet: updatedRatesheet as RatesheetsWithIncludes
		};
	},
	createOption: async ({ request }) => {
		const formData = await request.formData();

		const ratesheetId = formData.get('ratesheetId');
		const optionPackage = formData.get('optionPackage');
		const optionTermValue = formData.get('optionTermValue');
		const optionTermUnit = formData.get('optionTermUnit');
		const optionCost = formData.get('optionCost');

		const updatedRow = await client.option.create({
			data: {
				package: {
					create: {
						name: optionPackage as string
					}
				},
				details: {
					create: {
						termValue: optionTermValue as string,
						termUnit: optionTermUnit as string,
						cost: optionCost as string
					}
				},
				ratesheet: {
					connect: {
						id: ratesheetId as string
					}
				}
			}
		});

		const updatedRatesheet = await client.ratesheet.findUnique({
			where: {
				id: updatedRow.ratesheetId
			},
			include: {
				rows: true,
				options: {
					include: {
						package: true,
						details: true
					}
				},
				disclosuresSet: {
					include: {
						disclosures: true
					}
				},
				coverages: true
			}
		});

		return {
			ratesheet: updatedRatesheet as RatesheetsWithIncludes
		};
	}
} satisfies Actions;
