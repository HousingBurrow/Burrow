import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { StackServerApp } from '@stackframe/stack'

// Create a server app inline. It reads Stack cookies automatically in Next.js.
const stackServerApp = new StackServerApp({
  tokenStore: 'nextjs-cookie',
})

function splitName(full?: string) {
  if (!full) return { first: '', last: '' }
  const parts = full.trim().split(/\s+/)
  return { first: parts[0] ?? '', last: parts.slice(1).join(' ') ?? '' }
}

export async function GET() {
  try {
    // get current logged-in user (or null). No wizard files needed.
    const u = await stackServerApp.getUser({ or: 'return-null' })
    if (!u) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Try common email shapes; Stack can expose email in a few forms
    const email =
      (u as any).primaryEmail ||
      (u as any).email ||
      (u as any).emails?.[0]?.email ||
      (u as any).emails?.[0]?.address

    if (!email) {
      return NextResponse.json({ error: 'No email on user' }, { status: 400 })
    }

    // Build a display name → first/last
    const display =
      (u as any).displayName ||
      `${(u as any).firstName ?? ''} ${(u as any).lastName ?? ''}`.trim() ||
      (u as any).name
    const { first, last } = splitName(display)

    // Ensure a row exists for this email; DO NOT overwrite existing fields
    const user = await prisma.user.upsert({
      where: { email },
      create: {
        email,
        first_name: first,
        last_name: last,
        // your schema has these as non-nullable, so use safe defaults
        gender: '',
        age: 0,
      },
      update: {},
    })

    return NextResponse.json(user, { status: 200 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
