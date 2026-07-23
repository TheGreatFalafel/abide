import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

export const metadata: Metadata = {
  title: 'Abide — Bible Reading Path',
  description:
    'A habit-forming Bible reading plan with streaks, scripture memory, and friend circles.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const keyed = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)

  if (!keyed) {
    return (
      <html lang="en">
        <head>
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        </head>
        <body>{children}</body>
      </html>
    )
  }

  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        </head>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
