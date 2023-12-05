// import { client } from '$lib/server/prisma';
// import { json, type RequestHandler } from '@sveltejs/kit';

// export const GET: RequestHandler = async ({ url }) => {
// 	// console.log('url', url);

// 	const findSheetTerm = await url?.searchParams?.get('name');

// 	console.log('findSheetTerm', findSheetTerm);

// 	if (findSheetTerm) {
// 		console.log('has term');
// 		const ratesheet = await client.ratesheet.findFirst({
// 			where: {
// 				name: findSheetTerm
// 			},
// 			include: {
// 				rows: true,
// 				disclosures: true,
// 				coverages: true
// 			}
// 		});
// 		return json(ratesheet);
// 	}

// 	const ratesheets = await prisma.ratesheet.findMany({
// 		include: {
// 			rows: true,
// 			disclosures: true,
// 			coverages: true
// 		}
// 	});

// 	console.log('ratesheets', ratesheets);

// 	return json(ratesheets);
// };
