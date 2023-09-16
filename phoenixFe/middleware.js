import { NextResponse } from 'next/server';

const DEFINED_PATHS = ['/login', '/home'];

export async function middleware(request) {
	const { pathname } = request.nextUrl;

	if (!DEFINED_PATHS.includes(pathname)) {
		return NextResponse.redirect(new URL('/login', request.url));
	}
	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!.*\\.).*)', '/favicon.ico'],
};
