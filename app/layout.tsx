import type { Metadata } from 'next'
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
        {children} {/* ❗ NO Navbar here */}
      </body>
    </html>
  )
}