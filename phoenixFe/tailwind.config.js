/** @type {import('tailwindcss').Config} */
const { nextui } = require('@nextui-org/react');

module.exports = {
	content: [
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'../node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ['var(--nunito-sans)'],
			},
		},
	},
	darkMode: 'class',
	plugins: [
		nextui({
			themes: {
				light: {
					colors: {
						background: '#f9f9f9',
					},
				},
				dark: {
					colors: {
						background: '#000000',
					},
				},
			},
		}),
	],
};
