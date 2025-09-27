import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { StackServerApp } from '@stackframe/stack'

// inline server app (no extra setup files needed)
const stackServerApp = new StackServerApp({ tokenStore: 'nextjs-cookie' })

export async function PATCH(req: Request) {
  try {
    const u = await stackServerApp.getUser({ or: 'return-null' })
    if (!u) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // get email from Stack user in a robust way
    const email =
      (u as any).primaryEmail ||
      (u as any).email ||
      (u as any).emails?.[0]?.email ||
      (u as any).emails?.[0]?.address
    if (!email) return NextResponse.json({ error: 'No email on user' }, { status: 400 })

    const body = await req.json()

    // sanitize / coerce; your schema has gender (string, not null) and age (number, not null)
    const data: Record<string, any> = {}
    if (typeof body.first_name === 'string') data.first_name = body.first_name.trim()
    if (typeof body.last_name === 'string') data.last_name = body.last_name.trim()
    if (typeof body.gender === 'string') data.gender = body.gender.trim()
    if (body.age !== undefined) {
      const ageNum = Number(body.age)
      if (!Number.isFinite(ageNum) || ageNum < 0) {
        return NextResponse.json({ error: 'Invalid age' }, { status: 400 })
      }
      data.age = ageNum
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    const updated = await prisma.user.update({
      where: { email },
      data,
    })

    return NextResponse.json(updated, { status: 200 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
