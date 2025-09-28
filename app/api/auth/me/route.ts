import { NextResponse } from 'next/server'
import { StackServerApp } from '@stackframe/stack'

// Helper that inspects an unknown object safely (no `any`)
type UnknownRec = Record<string, unknown>

function extractEmail(user: unknown): string | null {
  const u = user as UnknownRec

  // primaryEmail can be a string or an object with { email: string }
  const primaryEmail = u['primaryEmail']
  if (typeof primaryEmail === 'string' && primaryEmail) {
    return primaryEmail
  }
  if (
    primaryEmail &&
    typeof primaryEmail === 'object' &&
    typeof (primaryEmail as UnknownRec)['email'] === 'string'
  ) {
    return (primaryEmail as UnknownRec)['email'] as string
  }

  // some SDKs expose a direct `email`
  if (typeof u['email'] === 'string' && u['email']) {
    return u['email'] as string
  }

  // or an array `emails: [{ email: string }, ...]`
  const emails = u['emails']
  if (Array.isArray(emails) && emails.length > 0) {
    const first = emails[0] as UnknownRec
    if (first && typeof first['email'] === 'string') {
      return first['email'] as string
    }
  }

  return null
}

export async function GET() {
  try {
    const stack = new StackServerApp({ tokenStore: 'nextjs-cookie' })
    const user = await stack.getUser({ or: 'return-null' })

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const email = extractEmail(user)
    if (!email) {
      return NextResponse.json({ error: 'No email on user' }, { status: 400 })
    }

    return NextResponse.json({ email })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Auth check failed' }, { status: 500 })
  }
}
