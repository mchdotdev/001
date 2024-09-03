/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			fontFamily: {
				'rubik': ['Rubik', 'sans-serif'],
				'tektur': ['Tektur', 'cursive'],
			},
			keyframes: {
				slideUpEnter: {
					'0%': {
						opacity: 0,
						transform: 'translateY(20px)',
					},
					'100%': {
						opacity: 1,
						transform: 'translateY(0px)',
					},
				},
				slideDownLeave: {
					'0%': {
						opacity: 1,
						transform: 'translateY(0px)',
					},
					'100%': {
						opacity: 0,
						transform: 'translateY(20px)',
					},
				},
				shake: {
					'0%': {
						transform: 'rotate(30deg)',
					},
					'50%': {
						transform: 'rotate(-30deg)',
					},
					'100%': {
						transform: 'rotate(30deg)',
					},
				},
			},
			animation: {
				slideUpEnter: '.5s ease-out slideUpEnter',
				slideDownLeave: '.5s ease-out slideDownLeave',
				shake: 'shake 5s infinite linear',
			},
		},
	},
	plugins: [],
};
