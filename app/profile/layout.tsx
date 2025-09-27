'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Layout, Menu } from 'antd'

const { Sider, Content } = Layout

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const selectedKey = pathname.startsWith('/profile/saved_houses')
    ? 'saved'
    : pathname.startsWith('/profile/my_listings')
    ? 'listings'
    : 'about'

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout>
        {/* Sidebar */}
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
                { key: 'listings', label: <Link href="/profile/my_listings">My Listings</Link> },
            ]}
          />
        </Sider>

        {/* Full-width content area */}
        <Content
          style={{
            background: '#fff',
            padding: 24,
            minHeight: '100%',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}
