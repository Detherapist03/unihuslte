// Root layout for UniHuslte
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'UniHuslte - The Student Marketplace for Nigeria',
  description: 'Buy and sell items, services, and connect with fellow students across Nigerian universities. Your campus marketplace.',
  keywords: 'student marketplace, Nigeria, university, campus trading, student services',
  authors: [{ name: 'UniHuslte Team' }],
  openGraph: {
    title: 'UniHuslte - The Student Marketplace for Nigeria',
    description: 'Your campus marketplace for buying and selling items and services',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        {children}
      </body>
    </html>
  )
}
