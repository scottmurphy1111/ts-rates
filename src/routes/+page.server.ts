import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import path from 'path';
import { writeFileSync } from 'fs';

export const actions = {
	default: async ({ request, cookies }) => {
		// const body = await request.formData();
		// // console.log('body', body);

		// const outputParams = {
		// 	cardTypes: body.getAll('cardTypes'),
		// 	markup: body.get('markup'),
		// 	customLogo: body.get('customLogo')
		// };

		// cookies.set('output', JSON.stringify(outputParams));

		const data = await request.formData();
		const cardTypes = data.getAll('cardTypes');
		const markup = data.get('markup');
		const customLogo = data.get('customLogo');

		if (!cardTypes || !markup) {
			return fail(400, { err: 'Cannot create Rate Card Template' });
		}
		cookies.set('cardTypes', JSON.stringify(cardTypes), { maxAge: 24 * 60 * 60 });
		cookies.set('markup', JSON.stringify(markup), { maxAge: 24 * 60 * 60 });

		if ((customLogo as File).size) {
			const file = data.get('customLogo') as File;
			const imageResource = `customLogos/${crypto.randomUUID()}.${file.type.split('/')[1]}`;
			// console.log('data', data);
			const filePath = path.join(process.cwd(), 'static', imageResource);
			// await fs.writeFile(filePath, file.stream());
			writeFileSync(filePath, Buffer.from(await file.arrayBuffer()));
			cookies.set('customLogo', imageResource, { maxAge: 24 * 60 * 60 });
		} else {
			cookies.set('customLogo', '', { maxAge: -1 });
		}

		throw redirect(302, '/output');
	}
} satisfies Actions;
