const defaultConfig = require( '@wordpress/scripts/config/eslint.config.cjs' );

const wpPackagesRegExp = '^@wordpress/(?!(icons|interface|style-engine))';

module.exports = [
	...defaultConfig,
	{
		files: [ '**/*.js', '**/*.jsx' ],
		rules: {
			'import/no-extraneous-dependencies': 'off',
			'import/no-unresolved': [
				'error',
				{
					ignore: [ wpPackagesRegExp ],
				},
			],
		},
	},
];
