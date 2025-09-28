'use client'

import { useEffect, useState } from 'react'
import { Card, Avatar, Typography, Button, Space, Spin } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'
import { getUserByEmail } from '@/lib/queries/users'
import Link from 'next/link'

type User = {
  id: number
  email: string
  first_name: string
  last_name: string
  gender: string
  age: number
  pfp?: string
}

export default function AboutMePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const me = await fetch('/api/auth/me', { cache: 'no-store' })
        if (!me.ok) {
          setError('Please sign in.')
          return
        }
        const { email } = (await me.json()) as { email: string }

        const res = await getUserByEmail(email)
        if (res.isError) {
          setError(res.message ?? 'Failed to fetch user')
          return
        }

        setUser(res.data ?? null)
        if (!res.data) {
          setError('No user profile found in database.')
        }
      } catch (e) {
        console.error(e)
        setError('Unexpected error loading profile.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  if (loading) return <Spin />

  if (error) return <Typography.Text type="danger">{error}</Typography.Text>

  if (!user) return <Typography.Text type="danger">No user found.</Typography.Text>

  return (
    <Card
      style={{ maxWidth: 350, margin: '0 auto', borderRadius: 12 }}
      bodyStyle={{ padding: '20px', textAlign: 'center' }}
    >
      <Avatar
        size={96}
        src={user.pfp || undefined}
        icon={!user.pfp ? <UserOutlined /> : undefined}
        style={{ marginBottom: 16 }}
      />

      <Typography.Title level={4} style={{ marginBottom: 4 }}>
        {user.first_name} {user.last_name}
      </Typography.Title>

      <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
        {user.email}
      </Typography.Text>

      <Typography.Paragraph style={{ marginBottom: 16 }}>
        Gender: {user.gender ?? 'Not set'} <br />
        Age: {user.age ?? 'Not set'}
      </Typography.Paragraph>

      <Link href="/settings">
        <Button type="primary" block>
          Edit Profile
        </Button>
      </Link>
    </Card>
  )
}
