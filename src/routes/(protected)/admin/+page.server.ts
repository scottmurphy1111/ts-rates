import { client } from '$lib/server/prisma';

export const load: PageServerLoad = async ({ locals }) => {
	const userId = locals.session?.userId as string;
	const rateOutput = await client.rateOutput.findMany({
		where: {
			userId: userId
		}
	});

	return {
		rateOutput: rateOutput as Rateoutput[]
	};
};
