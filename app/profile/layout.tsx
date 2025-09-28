'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Layout } from 'antd'

const { Sider, Content } = Layout

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const links = [
    { key: 'about', label: 'About Me', href: '/profile/about_me' },
    { key: 'saved', label: 'Saved Houses', href: '/profile/saved_houses' },
    { key: 'listings', label: 'My Listings', href: '/profile/my_listings' },
  ]

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
          width={240}
          style={{
            background: '#DCCFC0',
            borderRight: '1px solid #c2b6a6',
            padding: '24px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {links.map(link => (
            <Link
              key={link.key}
              href={link.href}
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                background: selectedKey === link.key ? '#b8a999' : 'transparent',
                color: selectedKey === link.key ? '#fff' : '#2c2c2c',
                fontWeight: selectedKey === link.key ? 600 : 500,
                textDecoration: 'none',
                fontSize: '16px',
                transition: 'all 0.25s ease',
                display: 'block',
              }}
            >
              {link.label}
            </Link>
          ))}
        </Sider>

        {/* Content area */}
        <Content
          style={{
            background: '#DCCFC0', // same as sidebar
            padding: 32,
            minHeight: '100%',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}