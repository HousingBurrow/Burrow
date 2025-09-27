'use client'

import { useEffect, useState } from 'react'
import { Card, Avatar, Typography, Button, Space, Spin, Modal, Form, Input, Select, InputNumber, message } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  gender: string | null
  age: number | null
}

export default function AboutMePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm()
  const router = useRouter()

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/user/by_email', { credentials: 'include' }) // you said your route is underscore
        if (res.status === 401) {
          router.push('/handler/sign-in?after_auth_return_to=/profile/about_me')
          return
        }
        if (!res.ok) throw new Error(`Failed: ${res.status}`)
        const data = (await res.json()) as User
        setUser(data)
      } catch (e) {
        console.error(e)
        setUser(null)
      } finally {
        setLoading(false)
      }
    })()
  }, [router])

  if (loading) return <Spin />
  if (!user) return <Typography.Text type="danger">No user found. Please log in.</Typography.Text>

  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ') || '—'

  const onEdit = () => {
    form.setFieldsValue({
      first_name: user.first_name ?? '',
      last_name: user.last_name ?? '',
      gender: user.gender ?? '',
      age: user.age ?? 0,
    })
    setOpen(true)
  }

  const onSubmit = async () => {
    try {
      const values = await form.validateFields()
      const res = await fetch('/api/user/update', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `Update failed: ${res.status}`)
      }
      const updated = (await res.json()) as User
      setUser(updated)
      setOpen(false)
      message.success('Profile updated')
    } catch (e: any) {
      message.error(e.message || 'Could not update profile')
    }
  }

  return (
    <>
      <Space direction="vertical" size="large" style={{ display: 'flex' }}>
        <Card>
          <Space direction="vertical" align="center" style={{ width: '100%' }}>
            <Avatar size={96} icon={<UserOutlined />} />
            <Typography.Title level={4} style={{ marginBottom: 0 }}>
              {fullName}
            </Typography.Title>
            <Typography.Paragraph type="secondary" style={{ textAlign: 'center', marginTop: 8 }}>
              Email: {user.email} <br />
              Gender: {user.gender || 'Not set'} <br />
              Age: {user.age ?? 'Not set'}
            </Typography.Paragraph>
            <Button onClick={onEdit}>Edit profile</Button>
          </Space>
        </Card>
      </Space>

      <Modal
        title="Edit profile"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={onSubmit}
        okText="Save"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="first_name" label="First name">
            <Input />
          </Form.Item>
          <Form.Item name="last_name" label="Last name">
            <Input />
          </Form.Item>
          <Form.Item name="gender" label="Gender">
            <Select
              options={[
                { value: '', label: '—' },
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'nonbinary', label: 'Non-binary' },
                { value: 'prefer_not_to_say', label: 'Prefer not to say' },
              ]}
            />
          </Form.Item>
          <Form.Item name="age" label="Age" rules={[{ type: 'number', min: 0, message: 'Age must be 0 or greater' }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
