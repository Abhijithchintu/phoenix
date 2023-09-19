const EPOCH_TO_SECS = 1000;

function setCookieOnBrowser({
	cookieName = '',
	cookie = '',
	expiresIn = 0,
	isProd = false,
}) {
	if (expiresIn === 0) {
		return;
	}

	try {
		const maxAge = new Date();

		maxAge.setTime(maxAge.getTime() + expiresIn * EPOCH_TO_SECS);
		const maxAgeUtc = maxAge.toUTCString();

		document.cookie = `${cookieName}=${cookie};expires=${maxAgeUtc};max-age=${expiresIn};${
			isProd ? 'secure;' : ''
		}path=/`;
	} catch (e) {
		console.log('e-', e);
	}
}
export { setCookieOnBrowser };
