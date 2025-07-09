import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AG Sindh Document Managment',
  description: 'AG Sindh Document Managment',
  generator: 'Ace Studios',
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
