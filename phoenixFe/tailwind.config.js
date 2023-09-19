/** @type {import('tailwindcss').Config} */
const { nextui } = require('@nextui-org/react');

const PRIMARY_COLOR_VARIANTS = {
	50: '#FEF3DB',
	100: '#FEF3DB',
	200: '#FEE5B8',
	300: '#FCD194',
	400: '#F9BE78',
	500: '#F6A04D',
	600: '#D37C38',
	700: '#B15C26',
	800: '#8E4018',
	900: '#762C0E',
	DEFAULT: '#F6A04D',
	foreground: '#ffffff',
};

// const DEFAULT_COLOR_VARIANTS = {
// 	50: '##e8fffe',
// 	100: '#E6FDFC',
// 	200: '#CEFBFC',
// 	300: '#B4F1F7',
// 	400: '#9EE2F0',
// 	500: '#7ECEE7',
// 	600: '#5CA5C6',
// 	700: '#3F7FA6',
// 	800: '#285B85',
// 	900: '#18416E',
// 	DEFAULT: '#F6A04D',
// 	foreground: '#ffffff',
// };

// const DANGER_COLOR_VARIANTS = {
// 	50: '#FBE2D1',
// 	100: '#F8BFA4',
// 	200: '#EB9074',
// 	300: '#D8644F',
// 	400: '#BF291E',
// 	500: '#A41517',
// 	600: '#890F1B',
// 	700: '#6E091B',
// 	800: '#5B051C',
// 	900: '#5B051C',
// 	DEFAULT: '#BF291E',
// 	foreground: '#ffffff',
// };

module.exports = {
	content: [
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'../node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
		'../FePackages/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ['var(--nunito-sans)'],
				pacifico: ['var(--pacifico)'],
			},
		},
	},
	darkMode: 'class',
	plugins: [
		nextui({
			themes: {
				light: {
					colors: {
						background: '#f4f4f4',
						foreground: '#4F4F4F',
						primary: PRIMARY_COLOR_VARIANTS,
						// default: DEFAULT_COLOR_VARIANTS,
						// danger: DANGER_COLOR_VARIANTS,
					},
				},
				dark: {
					colors: {
						background: '#4f4f4f',
						foreground: '#fffff',
					},
				},
			},
		}),
	],
};
// .swatch_1{
//     background: #f4f4f4;
// }
// .swatch_2{
//     background: #060606;
// }
// .swatch_3{
//     background: #d1cab4;
// }
// .swatch_4{
//     background: #ababab;
// }
// .swatch_5{
//     background: #453b27;
// }
// .swatch_6{
//     background: #575651;
// }
// .swatch_7{
//     background: #878473;
// }
