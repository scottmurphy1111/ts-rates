/** @type {import('tailwindcss').Config} */

import colors from 'tailwindcss/colors';

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
    colors: {
			'ts-blue': '#1575CF',
			'ts-gray-md': '#D5D5D5',
			white: colors.white,
			black: colors.black,
			red: colors.red
		}
  },
  plugins: [],
}

