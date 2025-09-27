"use client";

import { useUser, useStackApp } from "@stackframe/stack";
import { Row, Space, Button } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export function Header() {
  const pathname = usePathname();
  const isProfilePage = pathname.startsWith("/profile");
  const user = useUser();

  return (
    <Row
      style={{
        background: "#fff",
        height: 64,
        padding: "0 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #f0f0f0",
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Logo area */}
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          height: "100%",
        }}
      >
        <Image
          src="/logo.png"
          alt="Burrow Logo"
          width={200} // adjust size here
          height={200}
          style={{ objectFit: "contain" }}
        />
      </Link>

      <Space>
        <Link href="/">
          <Button type="text">Home</Button>
        </Link>

        <Link href="/profile/about_me">
          <Button type="text">Profile</Button>
        </Link>

        <Link href="/settings/">
          <Button type="text">Settings</Button>
        </Link>

        {!user ? (
          <>
            <Link href="/handler/sign-in">
              <Button type="primary">Log In</Button>
            </Link>
            <Link href="/handler/sign-up">
              <Button>Sign Up</Button>
            </Link>
          </>
        ) : (
          <Button type="primary" variant="outlined" onClick={() => user.signOut()}>
            Logout
          </Button>
        )}
      </Space>
    </Row>
  );
}
