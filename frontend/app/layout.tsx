import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Data Vault',
  description: 'A secure and private data vault for your sensitive information',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
