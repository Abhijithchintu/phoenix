import './globals.css';
import { Nunito_Sans } from 'next/font/google';
import { ThemeProvider } from '@pheonixfe/components';

const nunito = Nunito_Sans({
	weight: ['400', '700'],
	style: ['normal', 'italic'],
	subsets: ['latin'],
	display: 'swap',
	variable: '--nunito-sans',
});

export const metadata = {
	title: 'Sup!',
	description: 'FUN CHAT APP',
};

function RootLayout({ children }) {
	return (
		<html lang="en" className={`${nunito.variable} light`}>
			<body className="h-screen">
				<ThemeProvider>{children}</ThemeProvider>
			</body>
		</html>
	);
}

export default RootLayout;
