'use client';

import { NextUIProvider } from '@nextui-org/react';

function ThemeProvider({ children }) {
	return (
		<NextUIProvider className="h-screen w-screen">{children}</NextUIProvider>
	);
}

export default ThemeProvider;
