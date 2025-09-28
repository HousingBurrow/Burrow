"use client";

import { useEffect, useState } from "react";
import { Card, Avatar, Typography, Button, Space, Spin } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { getUserByEmail } from "@/lib/queries/users";
import Link from "next/link";
import { User } from "@prisma/client";

export default function AboutMePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const me = await fetch("/api/auth/me", { cache: "no-store" });
        if (!me.ok) {
          setError("Please sign in.");
          return;
        }
        const { email } = (await me.json()) as { email: string };

        const res = await getUserByEmail(email);
        if (res.isError) {
          setError(res.message ?? "Failed to fetch user");
          return;
        }

        setUser(res.data ?? null);
        if (!res.data) {
          setError("No user profile found in database.");
        }
      } catch (e) {
        console.error(e);
        setError("Unexpected error loading profile.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <Spin />;

  if (error) return <Typography.Text type="danger">{error}</Typography.Text>;

  if (!user)
    return <Typography.Text type="danger">No user found.</Typography.Text>;

  return (
    <Space direction="vertical" size="large" style={{ display: "flex" }}>
      <Card>
        <Space direction="vertical" align="center" style={{ width: "100%" }}>
          <Avatar
            size={96}
            src={user.pfp || undefined}
            icon={!user.pfp ? <UserOutlined /> : undefined}
          />

          <Typography.Title level={4} style={{ marginBottom: 0 }}>
            {user.first_name} {user.last_name}
          </Typography.Title>

          <Typography.Paragraph
            type="secondary"
            style={{ textAlign: "center", marginTop: 8 }}
          >
            Email: {user.email} <br />
            Gender: {user.gender ?? "Not set"} <br />
            Age: {user.age ?? "Not set"}
          </Typography.Paragraph>

          <Link href="/settings">
            <Button type="primary">Edit profile</Button>
          </Link>
        </Space>
      </Card>
    </Space>
  );
}
