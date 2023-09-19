import { NextResponse } from 'next/server';

const DEFINED_PATHS = ['/login', '/home', '/signup'];

const LOGIN_PATHS = ['/login', '/signup'];

async function authenticator({ request }) {
	const VERIFY_TOKEN_PATH = `${process.env.NEXT_PUBLIC_OAUTH_BASE_URL}/token/verify`;
	try {
		const accessToken = request.cookies.get(
			process.env.NEXT_PUBLIC_OAUTH_TOKEN_NAME,
		);

		const res = await fetch(VERIFY_TOKEN_PATH, {
			cache: 'no-store',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				[process.env.NEXT_PUBLIC_OAUTH_TOKEN_NAME]: accessToken?.value,
			},
		});

		const parsedRes = await res.json();

		return parsedRes?.valid || false;
	} catch (e) {
		return false;
	}
}

export async function middleware(request) {
	const { pathname } = request.nextUrl;
	const isPublicPage = LOGIN_PATHS.includes(pathname);

	const isAuthenticated = await authenticator({ request });

	if (isPublicPage && !isAuthenticated) {
		return NextResponse.next();
	}

	if (isPublicPage && isAuthenticated) {
		return NextResponse.redirect(new URL('/home', request.url));
	}

	if (!isAuthenticated) {
		return NextResponse.redirect(new URL('/login', request.url));
	}

	if (!DEFINED_PATHS.includes(pathname)) {
		return NextResponse.redirect(new URL('/home', request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!.*\\.).*)'],
};
