"use client";

import { Row, Space, Button } from "antd";
import Title from "antd/es/typography/Title";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  const isProfilePage = pathname.startsWith("/profile");

  return (
    <Row
      style={{
        background: "#fff",
        padding: "16px 32px",
        flexDirection: "row",
        display: "flex",
        justifyContent: "space-between",
        borderBottom: "1px solid #f0f0f0",
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

        <Button type="text">Logout</Button>
      </Space>
    </Row>
  );
}
