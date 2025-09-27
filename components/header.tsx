"use client";

import { useUser, useStackApp } from '@stackframe/stack';
import { Row, Space, Button } from 'antd'
import Title from 'antd/es/typography/Title'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Header() {
  const pathname = usePathname();
  const isProfilePage = pathname.startsWith("/profile");
  const user = useUser();
  const app = useStackApp();

  return (
    <Row
      style={{
        background: "#fff",
        padding: "16px 32px",
        display: "flex",
        justifyContent: "space-between",
        borderBottom: "1px solid #f0f0f0",
        top: 0,
        zIndex: 1000
      }}
    >
      <Link href="/">
        <Title level={3} style={{ margin: 0 }}>
          BURROW
        </Title>
      </Link>

      <Space>
        {isProfilePage ? (
          <Link href="/">
            <Button type="text">Home</Button>
          </Link>
        ) : (
          <Link href="/profile/about_me">
            <Button type="text">Profile</Button>
          </Link>
        )}

        <Link href="/settings">
          <Button type="text">Settings</Button>
        </Link>

        {!user ? (
          <>
            <Button type="primary" onClick={() => app.redirectToSignIn()}>
              Login
            </Button>
            <Button onClick={() => app.redirectToSignUp()}>Sign Up</Button>
          </>
        ) : (
          <Button type="primary" onClick={() => user.signOut()}>
            Logout
          </Button>
        )}
      </Space>
    </Row>
  );
}
