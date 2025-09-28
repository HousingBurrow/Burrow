import { NextResponse } from 'next/server'
import { StackServerApp } from '@stackframe/stack'
// If your SDK exports a proper type for the user, you can also:
// import type { CurrentUser } from '@stackframe/stack'

type MaybeEmailUser = {
  primaryEmail?: string | { email?: string }
  email?: string
  emails?: Array<{ email?: string }>
}

function extractEmail(obj: unknown): string | null {
  const u = obj as MaybeEmailUser

  // primaryEmail can be a string or an object with { email }
  if (typeof u.primaryEmail === 'string' && u.primaryEmail) {
    return u.primaryEmail
  }
  if (u.primaryEmail && typeof u.primaryEmail === 'object' && u.primaryEmail.email) {
    return u.primaryEmail.email || null
  }

  // some SDKs expose a direct email
  if (typeof u.email === 'string' && u.email) {
    return u.email
  }

  // or an array of emails
  if (Array.isArray(u.emails) && u.emails.length > 0) {
    const first = u.emails[0]
    if (first?.email) return first.email
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
