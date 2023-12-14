import type { PageServerLoad } from '../../$types';
import type { Actions } from '../../$types';
import { client } from '$lib/server/prisma';
import type {
	CoveragesSetWithIncludes,
	DisclosuresSetWithIncludes,
	RatesheetWithIncludes
} from '$lib/types/types';

export const load: PageServerLoad = async ({ depends }) => {
	depends('data:ratesheets');
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

	return {
		ratesheets: ratesheets as RatesheetWithIncludes[],
		disclosuresSets: disclosuresSets as DisclosuresSetWithIncludes[],
		coveragesSets: coveragesSets as CoveragesSetWithIncludes[]
	};
};

export const actions: Actions = {
	selectRatesheet: async ({ request }) => {
		const formData = await request.formData();

		const selectedRatesheetId = formData.get('selectedRatesheetId');

		const ratesheet = await client.ratesheet.findUnique({
			where: {
				id: selectedRatesheetId as string
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
			ratesheet: ratesheet as RatesheetWithIncludes
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
			ratesheet: updatedRatesheet as RatesheetWithIncludes
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
			ratesheet: updatedRatesheet as RatesheetWithIncludes
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
			ratesheet: updatedRatesheet as RatesheetWithIncludes
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
				packageName: optionPackage as string,
				termValue: optionTermValue as string,
				termUnit: optionTermUnit as string,
				cost: optionCost as string
			}
		});

		const updatedRatesheet = await client.ratesheet.findUnique({
			where: {
				id: updatedOption.ratesheetId
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
			ratesheet: updatedRatesheet as RatesheetWithIncludes
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
				packageName: optionPackage as string,
				termValue: optionTermValue as string,
				termUnit: optionTermUnit as string,
				cost: optionCost as string,
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
			ratesheet: updatedRatesheet as RatesheetWithIncludes
		};
	},
	selectDisclosuresSet: async ({ request }) => {
		const formData = await request.formData();

		const selectedRatesheetId = formData.get('selectedRatesheetId');
		const selectedDisclosuresSetId = formData.get('selectedDisclosuresSetId');

		const updatedRatesheet = await client.ratesheet.update({
			where: {
				id: selectedRatesheetId as string
			},
			data: {
				disclosuresSetId: selectedDisclosuresSetId as string
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
			ratesheet: updatedRatesheet as RatesheetWithIncludes
		};
	},
	selectCoveragesSet: async ({ request }) => {
		const formData = await request.formData();

		const selectedRatesheetId = formData.get('selectedRatesheetId');
		const selectedCoveragesSetId = formData.get('selectedCoveragesSetId');

		const updatedRatesheet = await client.ratesheet.update({
			where: {
				id: selectedRatesheetId as string
			},
			data: {
				coveragesSetId: selectedCoveragesSetId as string
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
			ratesheet: updatedRatesheet as RatesheetWithIncludes
		};
	}
} satisfies Actions;
