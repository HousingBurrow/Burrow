import { NextResponse } from 'next/server'
import { StackServerApp } from '@stackframe/stack'

export async function GET() {
  try {
    const stack = new StackServerApp({ tokenStore: 'nextjs-cookie' })
    const u = await stack.getUser({ or: 'return-null' })

    if (!u) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // primaryEmail can be a string in some SDK versions. Be defensive.
    const primary = (u as any).primaryEmail
    const email =
      (typeof primary === 'string' ? primary : primary?.email) ??
      // fallbacks if your SDK exposes email in a different place
      (u as any).email ??
      (Array.isArray((u as any).emails) ? (u as any).emails[0]?.email : undefined)

    if (!email) {
      return NextResponse.json({ error: 'No email on user' }, { status: 400 })
    }

    return NextResponse.json({ email })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Auth check failed' }, { status: 500 })
  }
}
