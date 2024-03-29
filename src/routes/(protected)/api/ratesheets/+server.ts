import { client } from '$lib/server/prisma';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, setHeaders }) => {
	setHeaders({
		'Access-Control-Allow-Origin': '*'
	});
	const id = url.searchParams.get('id');

	if (id) {
		const ratesheet = await client.ratesheet.findUnique({
			where: {
				id: id as string
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

		return json(ratesheet);
	}

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

	return json(ratesheets);
};

export const POST: RequestHandler = async ({ request }) => {
	const formData = await request.formData();

	const ratesheetId = formData.get('ratesheetId');
	const title = formData.get('title');
	const formattedName = title?.toString().toLowerCase().replace(/\s/g, '_');
	const subtitle = formData.get('subtitle');
	const lowMileageCutoff = formData.get('lowMileageCutoff');
	const isVocational = formData.get('isVocational');
	const rowIds = formData.getAll('rowId');
	const termValues = formData.getAll('termValue');
	const termUnits = formData.getAll('termUnit');
	const mileageValues = formData.getAll('mileageValue');
	const costsNewerLowMiles = formData.getAll('costNewerLowMiles');
	const costsNewerHighMiles = formData.getAll('costNewerHighMiles');
	const costsOlderLowMiles = formData.getAll('costOlderLowMiles');
	const costsOlderHighMiles = formData.getAll('costOlderHighMiles');
	const deductibles = formData.getAll('deductible');
	const aggregateLimits = formData.getAll('aggregateLimit');
	const truckTypes = formData.getAll('truckType');
	const optionIds = formData.getAll('optionId');
	const optionPackageNames = formData.getAll('optionPackageName');
	const optionTermValues = formData.getAll('optionTermValue');
	const optionTermUnits = formData.getAll('optionTermUnit');
	const optionCosts = formData.getAll('optionCost');
	const optionRefrigerationHours = formData.getAll('optionRefrigerationHours');
	const selectedDisclosuresSetId = formData.get('selectedDisclosuresSetId');
	const selectedCoveragesSetId = formData.get('selectedCoveragesSetId');

	const formattedRows = rowIds.reduce(
		(acc, id, i) => {
			const newItem = {
				[id as string]: {
					termValue: termValues[i] as string,
					termUnit: termUnits[i] as string,
					mileageValue: mileageValues[i] as string,
					costNewerLowMiles: costsNewerLowMiles[i] as string,
					costNewerHighMiles: costsNewerHighMiles[i] as string,
					costOlderLowMiles: costsOlderLowMiles[i] as string,
					costOlderHighMiles: costsOlderHighMiles[i] as string,
					deductible: deductibles[i] as string,
					aggregateLimit: aggregateLimits[i] as string,
					truckType: truckTypes[i] as string
				}
			};

			acc.push(newItem);
			return acc;
		},
		[] as Record<string, Record<string, string>>[]
	);

	const formattedOptions = optionIds.reduce(
		(acc, id, i) => {
			const newItem = {
				[id as string]: {
					packageName: optionPackageNames[i] as string,
					termValue: optionTermValues[i] as string,
					termUnit: optionTermUnits[i] as string,
					cost: optionCosts[i] as string,
					refrigerationHours: optionRefrigerationHours[i] as string
				}
			};

			acc.push(newItem);
			return acc;
		},
		[] as Record<string, Record<string, string>>[]
	);

	await client.ratesheet.upsert({
		where: {
			id: ratesheetId as string
		},
		update: {
			name: formattedName as string,
			title: title as string,
			subtitle: subtitle as string,
			lowMileageCutoff: lowMileageCutoff as string,
			isVocational: isVocational === 'true' // Convert string to boolean
		},
		create: {
			name: formattedName as string,
			title: title as string,
			subtitle: subtitle as string,
			lowMileageCutoff: lowMileageCutoff as string,
			isVocational: isVocational === 'true',
			rows: {
				create: formattedRows.map((row) => {
					const rowId = Object.keys(row)[0];
					const rowValues = Object.values(row)[0];

					return {
						id: rowId,
						termValue: rowValues.termValue as string,
						termUnit: rowValues.termUnit as string,
						mileageValue: rowValues.mileageValue as string,
						costNewerLowMiles: rowValues.costNewerLowMiles as string,
						costNewerHighMiles: rowValues.costNewerHighMiles as string,
						costOlderLowMiles: rowValues.costOlderLowMiles as string,
						costOlderHighMiles: rowValues.costOlderHighMiles as string,
						deductible: rowValues.deductible as string,
						aggregateLimit: rowValues.aggregateLimit as string,
						truckType: rowValues.truckType as string
					};
				})
			},
			options: {
				create: formattedOptions.map((option) => {
					const optionId = Object.keys(option)[0];
					const optionValues = Object.values(option)[0];

					return {
						id: optionId,
						packageName: optionValues.packageName as string,
						termValue: optionValues.termValue as string,
						termUnit: optionValues.termUnit as string,
						cost: optionValues.cost as string,
						refrigerationHours: optionValues.refrigerationHours as string
					};
				})
			}
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

	const updateRows = formattedRows.map((row) => {
		const rowId = Object.keys(row)[0];
		const rowValues = Object.values(row)[0];

		return client.row.upsert({
			where: {
				id: rowId
			},
			update: {
				termValue: rowValues.termValue as string,
				termUnit: rowValues.termUnit as string,
				mileageValue: rowValues.mileageValue as string,
				costNewerLowMiles: rowValues.costNewerLowMiles as string,
				costNewerHighMiles: rowValues.costNewerHighMiles as string,
				costOlderLowMiles: rowValues.costOlderLowMiles as string,
				costOlderHighMiles: rowValues.costOlderHighMiles as string,
				deductible: rowValues.deductible as string,
				aggregateLimit: rowValues.aggregateLimit as string,
				truckType: rowValues.truckType as string,
				ratesheet: {
					connect: {
						id: ratesheetId as string
					}
				}
			},
			create: {
				termValue: rowValues.termValue as string,
				termUnit: rowValues.termUnit as string,
				mileageValue: rowValues.mileageValue as string,
				costNewerLowMiles: rowValues.costNewerLowMiles as string,
				costNewerHighMiles: rowValues.costNewerHighMiles as string,
				costOlderLowMiles: rowValues.costOlderLowMiles as string,
				costOlderHighMiles: rowValues.costOlderHighMiles as string,
				deductible: rowValues.deductible as string,
				aggregateLimit: rowValues.aggregateLimit as string,
				truckType: rowValues.truckType as string,
				ratesheet: {
					connect: {
						id: ratesheetId as string
					}
				}
			}
		});
	});

	const updateOptions = formattedOptions.map((option) => {
		const optionId = Object.keys(option)[0];
		const optionValues = Object.values(option)[0];

		return client.option.upsert({
			where: {
				id: optionId
			},
			update: {
				packageName: optionValues.packageName as string,
				termValue: optionValues.termValue as string,
				termUnit: optionValues.termUnit as string,
				cost: optionValues.cost as string,
				refrigerationHours: optionValues.refrigerationHours as string,
				ratesheet: {
					connect: {
						id: ratesheetId as string
					}
				}
			},
			create: {
				packageName: optionValues.packageName as string,
				termValue: optionValues.termValue as string,
				termUnit: optionValues.termUnit as string,
				cost: optionValues.cost as string,
				refrigerationHours: optionValues.refrigerationHours as string,
				ratesheet: {
					connect: {
						id: ratesheetId as string
					}
				}
			}
		});
	});

	if (selectedDisclosuresSetId) {
		await client.disclosuresSet.update({
			where: {
				id: selectedDisclosuresSetId as string
			},
			data: {
				ratesheet: {
					connect: {
						id: ratesheetId as string
					}
				}
			}
		});
	}

	if (selectedCoveragesSetId) {
		await client.coveragesSet.update({
			where: {
				id: selectedCoveragesSetId as string
			},
			data: {
				ratesheet: {
					connect: {
						id: ratesheetId as string
					}
				}
			}
		});
	}

	await client.$transaction(updateRows);
	await client.$transaction(updateOptions);

	if (ratesheetId === 'new') {
		return json(null);
	}
	const updatedRatesheet = await client.ratesheet.findUnique({
		where: {
			id: ratesheetId as string
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

	return json(updatedRatesheet);
};

export const DELETE: RequestHandler = async ({ url }) => {
	const id = url.searchParams.get('id');

	const deleteRows = client.row.deleteMany({
		where: {
			ratesheetId: id as string
		}
	});

	const deleteOptions = client.option.deleteMany({
		where: {
			ratesheetId: id as string
		}
	});

	const deleteRatesheet = client.ratesheet.delete({
		where: {
			id: id as string
		}
	});

	await client.$transaction([deleteRows, deleteOptions, deleteRatesheet]);

	return json({ message: '👍 Ratesheet deleted successfully' });
};
