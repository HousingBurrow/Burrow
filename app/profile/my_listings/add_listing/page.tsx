'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Form, Input, InputNumber, Button, Typography, Card, Space, message } from 'antd'

export default function AddListingPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function onFinish(values: any) {
    try {
      setLoading(true)
      // TODO: replace with real API call when backend is ready
      // await fetch('/api/listings', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(values) })
      await new Promise(r => setTimeout(r, 700)) // mock delay
      message.success('Listing created')
      router.push('/profile/my_listings')
    } catch (e) {
      message.error('Failed to create listing')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card style={{ maxWidth: 700, margin: '0 auto' }}>
      <Typography.Title level={3}>Add New Listing</Typography.Title>

      <Form layout="vertical" onFinish={onFinish} initialValues={{ price: 500 }}>
        <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please enter a title' }]}>
          <Input placeholder="Cozy Apartment in Midtown" />
        </Form.Item>

        <Form.Item name="location" label="Location" rules={[{ required: true, message: 'Please enter a location' }]}>
          <Input placeholder="Atlanta, GA" />
        </Form.Item>

        <Form.Item name="price" label="Price (per month)" rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: '100%' }} prefix="$" />
        </Form.Item>

        <Form.Item name="image" label="Image URL">
          <Input placeholder="https://..." />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <Input.TextArea rows={4} placeholder="Describe the listing..." />
        </Form.Item>

        <Space>
          <Button onClick={() => router.back()}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={loading}>Create listing</Button>
        </Space>
      </Form>
    </Card>
  )
}
