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

export const POST: RequestHandler = async ({ url, locals, request }) => {
	console.log('url', url);
	console.log('body', request.body);

	const userId = url.searchParams.get('userId') || locals.session?.userId;
	const selectedRatesheetId = url.searchParams.get('selectedRatesheetId');
	const label = url.searchParams.get('label');
	const markup12 = url.searchParams.get('markup12');
	const markup24 = url.searchParams.get('markup24');
	const markup36 = url.searchParams.get('markup36');
	const markup48 = url.searchParams.get('markup48');
	const selectedColor = url.searchParams.get('selectedColor');
	const customLogo = url.searchParams.get('customLogo');

	// const selectedRatesheetId = data.get('selectedRatesheetId');
	// const label = data.get('label');
	// const markup12 = data.get('markup12');
	// const markup24 = data.get('markup24');
	// const markup36 = data.get('markup36');
	// const markup48 = data.get('markup48');
	// const selectedColor = data.get('selectedColor');
	// const customLogo = data.get('customLogo');

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

	const rateOutput = await client.rateOutput.create({
		data: {
			userId,
			ratesheetId: selectedRatesheetId as string,
			label: label as string,
			markups: {
				create: markupsData
			},
			color: selectedColor as string,
			logoUrl: customLogo as string
		}
	});

	return json(rateOutput);
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
