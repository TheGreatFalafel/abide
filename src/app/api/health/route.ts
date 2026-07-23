import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    ok: true,
    app: 'abide',
    hasDatabase: Boolean(process.env.DATABASE_URL),
    hasClerk: Boolean(process.env.CLERK_SECRET_KEY),
  })
}
