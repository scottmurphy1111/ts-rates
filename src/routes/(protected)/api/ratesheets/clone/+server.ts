import { client } from '$lib/server/prisma';
import { type RequestHandler, json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ url }) => {
	const ratesheetId = url.searchParams.get('ratesheetId');

	const ratesheetData = await client.ratesheet.findUnique({
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

	const cloneRatesheet = await client.ratesheet.create({
		data: {
			name: `${ratesheetData?.name}CLONE` as string,
			title: ratesheetData?.title as string,
			subtitle: ratesheetData?.subtitle as string,
			lowMileageCutoff: ratesheetData?.lowMileageCutoff as string,
			isVocational: ratesheetData?.isVocational as boolean,
			rows: {
				create: ratesheetData?.rows.map((row) => {
					return {
						termValue: row.termValue,
						termUnit: row.termUnit,
						mileageValue: row.mileageValue,
						costNewerLowMiles: row.costNewerLowMiles,
						costNewerHighMiles: row.costNewerHighMiles,
						costOlderLowMiles: row.costOlderLowMiles,
						costOlderHighMiles: row.costOlderHighMiles,
						deductible: row.deductible,
						aggregateLimit: row.aggregateLimit,
						truckType: row.truckType
					};
				})
			},
			options: {
				create: ratesheetData?.options.map((option) => {
					return {
						packageName: option.packageName,
						termValue: option.termValue,
						termUnit: option.termUnit,
						cost: option.cost,
						refrigerationHours: option.refrigerationHours
					};
				})
			},
			disclosuresSet: {
				create: {
					name: `${ratesheetData?.disclosuresSet?.name}CLONE` as string,
					disclosures: {
						create: ratesheetData?.disclosuresSet?.disclosures.map((disclosure) => {
							return {
								title: disclosure.title,
								description: disclosure.description,
								order: disclosure.order
							};
						})
					}
				}
			},
			coveragesSet: {
				create: {
					name: `${ratesheetData?.coveragesSet?.name}CLONE` as string,
					coverages: {
						create: ratesheetData?.coveragesSet?.coverages.map((coverage) => {
							return {
								title: coverage.title,
								description: coverage.description,
								order: coverage.order
							};
						})
					}
				}
			}
		}
	});

	const clonedRatesheetId = cloneRatesheet.id;

	const clonedRatesheet = await client.ratesheet.findUnique({
		where: {
			id: clonedRatesheetId as string
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

	return json(clonedRatesheet);
};
