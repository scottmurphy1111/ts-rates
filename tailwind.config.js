import type { Config } from 'tailwindcss'
import { join } from 'path';
import colors from 'tailwindcss/colors';
import { skeleton } from '@skeletonlabs/tw-plugin';
import { customTheme } from './src/custom-theme';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

export default {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
	theme: {
		extend: {},
		colors: {
			'ts-blue': '#1575CF',
			'ts-gray-md': '#D5D5D5',
			white: colors.white,
			black: colors.black,
			red: colors.red,
      teal: colors.teal,
      slate: colors.slate,
      amber: colors.amber,
      blue: colors.blue,
      sky: colors.sky,
      indigo: colors.indigo,
      rose: colors.rose
		}
	},
	plugins: [
    forms,
    typography,
		skeleton({
			themes: {
				custom: [customTheme]
			}
		})
	],
  purge: {
    options: {
      safelist: [
        {
          pattern: /(from|to|bg|text)-(red|teal|slate|amber|primary|sky|indigo|rose)-(500|900)/
        }
      ]
    }
  }
} satisfies Config;
