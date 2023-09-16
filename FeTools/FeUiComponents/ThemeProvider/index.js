'use client';

import { NextUIProvider } from '@nextui-org/react';

function ThemeProvider({ children }) {
	return <NextUIProvider>{children}</NextUIProvider>;
}

export default ThemeProvider;
