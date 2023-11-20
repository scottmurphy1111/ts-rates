import type { Ratesheet } from '@prisma/client';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ fetch }) => {
	// const res = await fetch('/api/rate-sheets');
	// // console.log('RES', await res.json());
	// const ratesheets = await res.json();
	// return {
	// 	ratesheets: ratesheets as Ratesheet[]
	// };
};
