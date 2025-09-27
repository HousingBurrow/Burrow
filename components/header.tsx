"use client";

import { useUser, useStackApp } from '@stackframe/stack';
import { Row, Space, Button } from 'antd';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export function Header() {
  const pathname = usePathname();
  const isProfilePage = pathname.startsWith("/profile");
  const user = useUser();
  const app = useStackApp();

  return (
    <Row
      style={{
        background: "#fff",
        height: 64, // ✅ fixed header height
        padding: "0 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center", // ✅ center content vertically
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      {/* Logo area */}
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          height: "100%", // ✅ keeps logo within header
        }}
      >
        <Image
          src="/logo.png"
          alt="Burrow Logo"
          width={200}   // adjust size here
          height={200}
          style={{ objectFit: "contain" }}
        />
      </Link>

      <Space>
        {isProfilePage ? (
          <Link href="/"><Button type="text">Home</Button></Link>
        ) : (
          <Link href="/profile/about_me"><Button type="text">Profile</Button></Link>
        )}

        <Link href="/settings/">
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
