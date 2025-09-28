"use client";

import { useUser } from "@stackframe/stack";
import { Button, Row, Space } from "antd";
import Image from "next/image";
import Link from "next/link";

export function Header() {
  const user = useUser();

  return (
    <Row
      style={{
        background: "#DCCFC0",
        height: 64,
        width: "100%",
        padding: "0 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #171717",
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Logo area */}
      <Link
        href="/"
        style={{
          height: "80%",
          width: "10%",
          position: "relative",
        }}
      >
        <Image
          src="/cropped_logo.png"
          alt="Burrow Logo"
          fill
          style={{ objectFit: "fill" }}
          priority
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

        {user && (
          <Link href="/new-listing">
            <Button type="text">New Listing</Button>
          </Link>
        )}

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
          <Button
            type="primary"
            variant="outlined"
            onClick={() => user.signOut()}
          >
            Logout
          </Button>
        )}
      </Space>
    </Row>
  );
}
