import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Output } from '$lib/types/types';

export const load: PageServerLoad = ({ cookies }) => {
	const cardTypes = cookies.get('cardTypes');
	const markup = cookies.get('markup');
	const customLogo = cookies.get('customLogo');

	if (!cardTypes || !markup) {
		return fail(400, { err: 'Cannot create Rate Card Template' });
	}

	return {
		output: <Output>{
			cardTypes: JSON.parse(cardTypes),
			markup: JSON.parse(markup),
			customLogo
		}
	};
};
