import type { Metadata } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import './globals.css'
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

const siteUrl = 'https://demosportfolio.netlify.app'
const shareDescription =
  'Full-stack software engineer building thoughtful, fast, well-crafted products.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Demos',
  description: 'Portfolio of Nasiru Iyidemilade',
  generator: 'Demos',
  openGraph: {
    title: 'Demos — Nasiru Iyidemilade',
    description: shareDescription,
    url: siteUrl,
    siteName: 'Demos',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Demos — Nasiru Iyidemilade',
    description: shareDescription,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        {children}
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="dark"
        />
      </body>
    </html>
  )
}
