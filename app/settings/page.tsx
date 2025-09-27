'use client'

import { Typography, Button, Modal, message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

export default function SettingsPage() {
  const onDelete = () => {
    Modal.confirm({
      title: 'Delete account?',
      icon: <ExclamationCircleOutlined style={{ color: '#cf1322' }} />,
      content: (
        <Text>
          This will permanently delete your account and all associated data. This action
          cannot be undone.
        </Text>
      ),
      okText: 'Delete',
      okButtonProps: { danger: true },
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          // TODO: connect with your backend
          await new Promise((r) => setTimeout(r, 600))
          message.success('Account deleted successfully.')
        } catch {
          message.error('Failed to delete account.')
        }
      },
    })
  }

  return (
    <div style={{ background: '#fff', padding: 24, minHeight: '100%' }}>
      <Title level={3} style={{ marginTop: 0 }}>
        Settings
      </Title>

      <div style={{ marginTop: 24 }}>
        <Title level={5} style={{ color: '#cf1322' }}>
          Delete account
        </Title>
        <Text type="secondary">
          Permanently remove your account and all related data. This cannot be undone.
        </Text>
        <div style={{ marginTop: 12 }}>
          <Button danger onClick={onDelete}>
            Delete account
          </Button>
        </div>
      </div>
    </div>
  )
}
