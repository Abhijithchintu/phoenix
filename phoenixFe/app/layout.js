import './globals.css';
import { Nunito_Sans, Pacifico } from 'next/font/google';
import { ThemeProvider } from '@pheonixfe/components';

const nunito = Nunito_Sans({
	weight: ['400', '700'],
	style: ['normal', 'italic'],
	subsets: ['latin'],
	display: 'swap',
	variable: '--nunito-sans',
});

const pacifico = Pacifico({
	weight: ['400'],
	style: ['normal'],
	subsets: ['latin'],
	display: 'swap',
	variable: '--pacifico',
});

export const metadata = {
	title: 'Sup!',
	description: 'FUN CHAT APP',
};

function RootLayout({ children }) {
	return (
		<html lang="en" className={`${nunito.variable} ${pacifico.variable} light`}>
			<body className="h-screen w-screen">
				<ThemeProvider>{children}</ThemeProvider>
			</body>
		</html>
	);
}

export default RootLayout;
