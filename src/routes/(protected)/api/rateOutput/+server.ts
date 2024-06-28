import { client } from '$lib/server/prisma';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const id = url.searchParams.get('id');

	const rateOutput = await client.rateOutput.findUnique({
		where: {
			id: id as string
		},
		include: {
			markups: true
		}
	});

	return json(rateOutput);
};

type RateOutputJSON = {
	rateOutputId: string;
	locationProgramId: string;
	userId: string;
	ratesheetId: string;
	label: string;
	markup12: string;
	markup24: string;
	markup36: string;
	markup48: string;
	selectedColor: string;
	customLogo: string | null;
};

export const POST: RequestHandler = async ({ request }) => {
	const rawBody = (await request.json()) as RateOutputJSON;
	const {
		rateOutputId,
		locationProgramId,
		userId,
		ratesheetId,
		label,
		markup12,
		markup24,
		markup36,
		markup48,
		selectedColor,
		customLogo
	} = rawBody;

	const markupsData = [
		{
			termValue: '12',
			markupValue: markup12 as string
		},
		{
			termValue: '24',
			markupValue: markup24 as string
		},
		{
			termValue: '36',
			markupValue: markup36 as string
		},
		{
			termValue: '48',
			markupValue: markup48 as string
		}
	];

	let rateOutput;
	if (rateOutputId) {
		rateOutput = await client.rateOutput.update({
			where: {
				id: rateOutputId as string
			},
			data: {
				markups: {
					deleteMany: {
						rateOutputId: rateOutputId as string
					},
					createMany: {
						data: markupsData.map((markup) => ({
							termValue: markup.termValue,
							markupValue: markup.markupValue
						}))
					}
				}
			}
		});
	} else {
		rateOutput = await client.rateOutput.create({
			data: {
				userId,
				locationProgramId: locationProgramId as string,
				ratesheetId,
				label: label as string,
				markups: {
					createMany: {
						data: markupsData.map((markup) => ({
							termValue: markup.termValue,
							markupValue: markup.markupValue
						}))
					}
				},
				color: selectedColor as string,
				logoUrl: customLogo as string
			}
		});
	}
	return json({ id: rateOutput.id });
};

export const DELETE: RequestHandler = async ({ url }) => {
	const id = url.searchParams.get('id');

	const deleteMarkups = client.markup.deleteMany({
		where: {
			rateOutputId: id as string
		}
	});

	const rateOutput = client.rateOutput.delete({
		where: {
			id: id as string
		}
	});

	await client.$transaction([deleteMarkups, rateOutput]);

	return json({ message: '👍 Rate Output deleted successfully' });
};
