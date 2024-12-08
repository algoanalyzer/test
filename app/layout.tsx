import './globals.css'
import { Inter } from 'next/font/google'
import StoreProvider from './StoreProvider'
import ThemeProvider from './ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className + " h-screen overflow-hidden flex flex-grow flex-col"}>
        <StoreProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  )
}

// Export Layout with the store.
export default RootLayout
