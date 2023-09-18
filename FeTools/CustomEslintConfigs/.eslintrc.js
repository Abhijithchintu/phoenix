module.exports = {
	extends: [
		'airbnb-base',
		'eslint:recommended',
		'plugin:import/errors',
		'plugin:react/recommended',
		'plugin:jsx-a11y/recommended',
		'plugin:prettier/recommended',
		'prettier',
	],
	plugins: ['react-hooks'],
	env: {
		node: true,
		es6: true,
		browser: true,
	},
	parserOptions: {
		ecmaVersion: 2020,
	},
	rules: {
		'no-console': 'off',
		'no-unused-vars': [
			'error',
			{
				ignoreRestSiblings: true,
				destructuredArrayIgnorePattern: '[A-Z]',
				caughtErrors: 'none',
			},
		],
		'no-underscore-dangle': 'off',
		'no-tabs': 'off',
		camelcase: 'off',
		'import/named': 'off',
		'import/extensions': 'off',
		'import/no-extraneous-dependencies': 'off',
		'import/prefer-default-export': 'off',
		'react/jsx-props-no-spreading': 'off',
		'react/jsx-indent-props': [2, 'tab'],
		'react/no-array-index-key': 'warn',
		'react/jsx-one-expression-per-line': 'off',
		'jsx-a11y/mouse-events-have-key-events': 'off',
		'jsx-a11y/media-has-caption': 'off',
		'jsx-a11y/anchor-is-valid': 'off',
		'react/jsx-filename-extension': 'off',
		'react/prop-types': 'off',
		'no-multi-spaces': [
			'error',
			{
				exceptions: {
					ImportDeclaration: true,
				},
			},
		],
		'object-curly-newline': [
			'error',
			{
				ImportDeclaration: { multiline: true, consistent: true },
				ExportDeclaration: { multiline: true, consistent: true },
				ObjectExpression: {
					multiline: true,
					consistent: true,
					minProperties: 4,
				},
				ObjectPattern: { multiline: true, consistent: true },
			},
		],
		'react/forbid-prop-types': 'off',
		'no-use-before-define': 'off',
		'react/react-in-jsx-scope': 'off',
		'react/require-default-props': 'off',
		'max-len': ['error', { code: 250 }],
		'prettier/prettier': [
			'error',
			{
				useTabs: true,
				tabWidth: 2,
				semi: true,
				singleQuote: true,
				trailingComma: 'all',
			},
			{
				usePrettierrc: false,
			},
		],
	},
	settings: {
		'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
		'import/resolver': {
			node: { extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.svg'] },
		},
	},
	overrides: [
		{
			files: ['*.json', '*.tsx'],
			rules: {
				'no-unused-expressions': 'off',
				curly: 2,
			},
		},
	],
};
