/** @type {import('next').NextConfig} */

const loadEnvConfig = require('dotenv').config();

console.log(process.env.NEXT_PUBLIC_TEST);

module.exports = {
	env: { ...loadEnvConfig.parsed },
	reactStrictMode: true,
	swcMinify: true,
	transpilePackages: [
		'@pheonixfe/components',
		'@phoenixfe/hooks',
		'@phoenixfe/utils',
		'@phoenixfe/auth-components',
		'@phoenixfe/welcomepage',
	],
};
