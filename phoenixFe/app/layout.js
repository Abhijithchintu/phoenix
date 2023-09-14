import './globals.css'
import { Nunito } from 'next/font/google'

const inter = Nunito({
weight: ['400', '700'],
style: ['normal', 'italic'],
subsets: ['latin'],
display: 'swap', 
})

export const metadata = {
  title: 'PHOENIX',
  description: 'FUN CHAT APP',
} 





function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

export default RootLayout;