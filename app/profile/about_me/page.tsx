'use client'

import { Card, Avatar, Typography, Button, Space } from 'antd'
import { UserOutlined } from '@ant-design/icons'

export default function AboutMePage() {
  return (
    <Space direction="vertical" size="large" style={{ display: 'flex' }}>
      {/* Profile card */}
      <Card>
        <Space direction="vertical" align="center" style={{ width: '100%' }}>
          <Avatar size={96} icon={<UserOutlined />} />
          <Typography.Title level={4} style={{ marginBottom: 0 }}>
            Priarie
          </Typography.Title>

          {/* ✅ About me section */}
          <Typography.Paragraph type="secondary" style={{ textAlign: 'center', marginTop: 8 }}>
            Hi, I’m Priarie. I love traveling, meeting new people, and finding cozy homes in the city.
          </Typography.Paragraph>

          <Button>Edit profile</Button>
        </Space>
      </Card>
    </Space>
  )
}