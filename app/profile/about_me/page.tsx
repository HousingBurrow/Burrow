'use client'

import { useEffect, useState } from 'react'
import { Card, Avatar, Typography, Button, Space, Spin } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { getUserByEmail } from '@/lib/queries/users'

type User = {
  id: number
  email: string
  first_name: string
  last_name: string
  gender: string
  age: number
}

export default function AboutMePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        // 1) ask server who is logged in
        const me = await fetch('/api/auth/me', { cache: 'no-store' })
        if (!me.ok) {
          setError('Please sign in.')
          return
        }
        const { email } = await me.json() as { email: string }

        // 2) use YOUR QUERY to fetch the Prisma user by email
        const res = await getUserByEmail(email)
        if (res.isError) {
          setError(res.message ?? 'Failed to fetch user')
          return
        }

        setUser(res.data ?? null) // avoid undefined → TS-safe
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

  if (error) {
    return <Typography.Text type="danger">{error}</Typography.Text>
  }

  if (!user) {
    return <Typography.Text type="danger">No user found.</Typography.Text>
  }

  return (
    <Space direction="vertical" size="large" style={{ display: 'flex' }}>
      <Card>
        <Space direction="vertical" align="center" style={{ width: '100%' }}>
          <Avatar size={96} icon={<UserOutlined />} />

          <Typography.Title level={4} style={{ marginBottom: 0 }}>
            {user.first_name} {user.last_name}
          </Typography.Title>

          <Typography.Paragraph type="secondary" style={{ textAlign: 'center', marginTop: 8 }}>
            Email: {user.email} <br />
            Gender: {user.gender ?? 'Not set'} <br />
            Age: {user.age ?? 'Not set'}
          </Typography.Paragraph>

          <Button>Edit profile</Button>
        </Space>
      </Card>
    </Space>
  )
}
