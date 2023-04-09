import { Open_Sans } from 'next/font/google'
import { ReactNode } from 'react'
import NavBar from './components/NavBar'
import { AuthProvider } from './context/AuthContext'
import QueryProvider from './context/QueryProvider'
import './globals.css'

export const metadata = {
  title: 'Restaurant App',
  description: 'Restaurant App',
}

const font = Open_Sans({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en' className={font.className}>
      <body>
        <main className='bg-gray-100 min-h-screen w-screen'>
          <QueryProvider>
            <AuthProvider>
              <main className='max-w-screen-xl m-auto bg-white'>
                <NavBar />
                {children}
              </main>
            </AuthProvider>
          </QueryProvider>
        </main>
      </body>
    </html>
  )
}
