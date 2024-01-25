import { type RequestHandler, json } from '@sveltejs/kit';

import { client } from '$lib/server/prisma';

export const POST: RequestHandler = async ({ request }) => {
	const formData = await request.formData();

	const coveragesSetId = formData.get('coveragesSetId');
	const name = formData.get('name');

	const coverageIds = formData.getAll('coverageId');
	const coverageTitles = formData.getAll('coverageTitle');
	const coverageDescriptions = formData.getAll('coverageDescription');
	const coverageOrders = formData.getAll('coverageOrder');

	const updatedCoverages = coverageIds.map((coverageId, index) => ({
		id: coverageId as string,
		title: coverageTitles[index] as string,
		description: coverageDescriptions[index] as string,
		order: coverageOrders[index] as string
	}));

	if (coveragesSetId?.toString().startsWith('new')) {
		const newCoveragesSet = await client.coveragesSet.create({
			data: {
				name: name as string,
				coverages: {
					create: updatedCoverages.map((updatedCoverage) => ({
						title: updatedCoverage.title,
						description: updatedCoverage.description,
						order: updatedCoverage.order
					}))
				}
			},
			include: {
				coverages: true
			}
		});

		return json(newCoveragesSet);
	}
	await client.coveragesSet.update({
		where: {
			id: coveragesSetId as string
		},
		data: {
			name: name as string
		},
		include: {
			coverages: true
		}
	});

	await client.$transaction(
		updatedCoverages.map((updatedCoverage) => {
			if (!updatedCoverage?.id.startsWith('new')) {
				return client.coverage.update({
					where: {
						id: updatedCoverage.id
					},
					data: {
						title: updatedCoverage.title,
						description: updatedCoverage.description,
						order: updatedCoverage.order
					}
				});
			} else {
				return client.coverage.create({
					data: {
						title: updatedCoverage.title,
						description: updatedCoverage.description,
						order: updatedCoverage.order,
						coveragesSet: {
							connect: {
								id: coveragesSetId as string
							}
						}
					}
				});
			}
		})
	);

	const updatedCoveragesSet = await client.coveragesSet.findUnique({
		where: {
			id: coveragesSetId as string
		},
		include: {
			coverages: true
		}
	});

	return json(updatedCoveragesSet);
};

export const DELETE: RequestHandler = async ({ url }) => {
	const id = url.searchParams.get('id');
	const coveragesSetId = url.searchParams.get('coveragesSetId');

	await client.coverage.delete({
		where: {
			id: id as string
		}
	});

	const updatedCoverageSet = await client.coveragesSet.findUnique({
		where: {
			id: coveragesSetId as string
		},
		include: {
			coverages: true
		}
	});

	return json(updatedCoverageSet);
};
