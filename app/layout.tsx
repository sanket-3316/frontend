import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import '@/app/globals.css'

export const metadata: Metadata = {
  title: 'Bremont Strategy | Strategic Market Intelligence',
  description: 'Leading independent management consulting firm delivering bespoke business intelligence for multi-million dollar capital allocations worldwide.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased min-h-screen flex flex-col bg-white">
        {/* Rendered once here (not per-component) so a toast queued right
            before a modal/component unmounts (e.g. closing the Request
            Sample modal on success) still has somewhere to render. */}
        <Toaster position="top-right" />
        {children} {/* ❗ NO Navbar here */}
      </body>
    </html>
  )
}