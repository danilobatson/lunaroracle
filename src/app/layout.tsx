import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LunarOracle API',
  description: 'AI-powered crypto predictions using social sentiment data',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
