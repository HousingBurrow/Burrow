'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Layout, Menu, Typography, Button, Space } from 'antd'

const { Header, Sider, Content } = Layout
const { Text } = Typography

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
const selectedKey = pathname.startsWith('/profile/saved_houses')
  ? 'saved'
  : pathname.startsWith('/profile/my_listings')
  ? 'listings'
  : 'about'

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Navbar (same as homepage, but "Home" instead of "Profile") */}
<Header
  style={{
    background: '#fff',
    paddingInline: 24,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #f0f0f0',
  }}
>
  <Typography.Text strong style={{ fontSize: 18 }}>BURROW</Typography.Text>

  <Space>
    <Link href="/homepage">
      <Button type="text">Home</Button>
    </Link>

    {/* NEW: Add Listing button */}
    <Link href="/profile/my_listings/add_listing">
      <Button type="text">Add Listing</Button>
    </Link>

    <Link href="/settings">
      <Button type="text">Settings</Button>
    </Link>

    <Button type="text">Logout</Button>
  </Space>
</Header>


      {/* Sidebar + content */}
      <Layout>
        <Sider
          width={220}
          style={{
            background: '#fff',
            borderRight: '1px solid #f0f0f0',
            paddingTop: 8,
          }}
        >
            <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            items={[
                { key: 'about', label: <Link href="/profile/about_me">About Me</Link> },
                { key: 'saved', label: <Link href="/profile/saved_houses">Saved Houses</Link> },
                { key: 'listings', label: <Link href="/profile/my_listings">My Listings</Link> }, // ✅ new item
            ]}
            />

        </Sider>

        <Content
          style={{
            background: '#fff',
            margin: '24px',
            padding: 24,
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}
