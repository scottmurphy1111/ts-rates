import { type RequestHandler, json } from '@sveltejs/kit';

import { client } from '$lib/server/prisma';

export const GET: RequestHandler = async ({ url }) => {
	const id = url.searchParams.get('id');

	const disclosuresSet = await client.disclosuresSet.findUnique({
		where: {
			id: id as string
		},
		include: {
			disclosures: true
		}
	});

	return json(disclosuresSet);
};

export const POST: RequestHandler = async ({ request }) => {
	const formData = await request.formData();

	const disclosuresSetId = formData.get('disclosuresSetId');
	const name = formData.get('name');

	const disclosureIds = formData.getAll('disclosureId');
	const disclosureTitles = formData.getAll('disclosureTitle');
	const disclosureDescriptions = formData.getAll('disclosureDescription');
	const disclosureOrders = formData.getAll('disclosureOrder');

	const updatedDisclosures = disclosureIds.map((disclosureId, index) => ({
		id: disclosureId as string,
		title: disclosureTitles[index] as string,
		description: disclosureDescriptions[index] as string,
		order: disclosureOrders[index] as string
	}));

	if (disclosuresSetId?.toString().startsWith('new')) {
		const newDisclosuresSet = await client.disclosuresSet.create({
			data: {
				name: name as string,
				disclosures: {
					create: updatedDisclosures.map((updatedDisclosure) => ({
						title: updatedDisclosure.title,
						description: updatedDisclosure.description,
						order: updatedDisclosure.order
					}))
				}
			},
			include: {
				disclosures: true
			}
		});

		return json(newDisclosuresSet);
	}
	await client.disclosuresSet.update({
		where: {
			id: disclosuresSetId as string
		},
		data: {
			name: name as string
		},
		include: {
			disclosures: true
		}
	});

	await client.$transaction(
		updatedDisclosures.map((updatedDisclosure) => {
			if (!updatedDisclosure?.id.startsWith('new')) {
				return client.disclosure.update({
					where: {
						id: updatedDisclosure.id
					},
					data: {
						title: updatedDisclosure.title,
						description: updatedDisclosure.description,
						order: updatedDisclosure.order
					}
				});
			} else {
				return client.disclosure.create({
					data: {
						title: updatedDisclosure.title,
						description: updatedDisclosure.description,
						order: updatedDisclosure.order,
						disclosuresSet: {
							connect: {
								id: disclosuresSetId as string
							}
						}
					}
				});
			}
		})
	);

	const updatedDisclosuresSet = await client.disclosuresSet.findUnique({
		where: {
			id: disclosuresSetId as string
		},
		include: {
			disclosures: true
		}
	});

	return json(updatedDisclosuresSet);
};

export const DELETE: RequestHandler = async ({ url }) => {
	const id = url.searchParams.get('id');
	const disclosuresSetId = url.searchParams.get('disclosuresSetId');

	await client.disclosure.delete({
		where: {
			id: id as string
		}
	});

	const updatedDisclosuresSet = await client.disclosuresSet.findUnique({
		where: {
			id: disclosuresSetId as string
		},
		include: {
			disclosures: true
		}
	});

	return json(updatedDisclosuresSet);
};
