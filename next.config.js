const withPWA = require('next-pwa');

module.exports = withPWA({
	pwa: {
		dest: "public",
		swSrc: "service-worker.js",
		//register: true,
		//skipWaiting: true,
	},
	future: { webpack5: true },
});