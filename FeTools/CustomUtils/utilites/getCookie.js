function getCookiefromRegex({ name, cookieString }) {
	const [cookie = ''] = cookieString.match(new RegExp(`${name}=([^;]+)`)) || [];

	return cookie;
}

function getCookiesOnServer({ cookieName, reqObj }) {
	try {
		return getCookiefromRegex({
			name: cookieName,
			cookieString: reqObj?.req?.headers?.cookie,
		});
	} catch (err) {
		return null;
	}
}

function getCookieOnClient({ name }) {
	if (typeof window === 'undefined') {
		return null;
	}

	try {
		return getCookiefromRegex({ name, cookieString: document.cookie });
	} catch (err) {
		return null;
	}
}

export { getCookieOnClient, getCookiesOnServer };
