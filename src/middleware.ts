import { NextResponse } from 'next/server'
import type { NextFetchEvent, NextRequest } from 'next/server'

export default function middleware(req: NextRequest, event: NextFetchEvent) {
  if (!process.env.CLERK_SECRET_KEY || !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return NextResponse.next()
  }

  // Dynamic require so local builds without Clerk keys still work.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { clerkMiddleware, createRouteMatcher } = require('@clerk/nextjs/server') as typeof import('@clerk/nextjs/server')

  const isPublic = createRouteMatcher([
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/api/health',
  ])

  return clerkMiddleware(async (auth, request) => {
    if (request.nextUrl.pathname.startsWith('/api/') && !isPublic(request)) {
      await auth()
    }
  })(req, event)
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
