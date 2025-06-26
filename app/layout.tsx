import type { Metadata } from 'next'
import './globals.css'
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"


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
      <body>{children}</body>
    </html>
  )
}
