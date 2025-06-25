import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Demos',
  description: 'Portfolio of Nasiru Iyidemilade',
  generator: 'Demos.dev',
   icons: {
    icon: '/Favicon.ico',
  },
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
