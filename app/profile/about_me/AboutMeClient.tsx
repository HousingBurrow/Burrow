"use client";

import { Card, Avatar, Typography, Button, Space } from "antd";
import { FiEdit3, FiMail, FiUser } from "react-icons/fi";
import Link from "next/link";

type Profile = {
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  gender: "Male" | "Female" | "Other" | "Prefer not to say";
  pfp?: string;
};

export default function AboutMeClient({ profile }: { profile: Profile }) {
  const { firstName, lastName, email, age, gender, pfp } = profile;

  return (
    <div style={{ minHeight: "100vh", padding: 32 }}>
      <Card
        style={{
          maxWidth: 800,
          margin: "0 auto",
          borderRadius: 24,
          padding: 32,
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          background: "linear-gradient(180deg, #ffffff 0%, #fafafa 100%)",
        }}
      >
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          <Space direction="vertical" align="center" style={{ width: "100%" }} size="middle">
            <Avatar
              size={100}
              src={pfp}
              style={{ backgroundColor: "#6F826A", fontSize: 32 }}
            >
              {!pfp &&
                `${firstName[0]?.toUpperCase() || "U"}${lastName[0]?.toUpperCase() || ""}`}
            </Avatar>

            <Typography.Title level={3} style={{ marginBottom: 0 }}>
              {firstName} {lastName}
            </Typography.Title>

            <Typography.Text type="secondary" style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <FiMail /> {email}
            </Typography.Text>
          </Space>

          <Card style={{ borderRadius: 16 }}>
            <Space direction="vertical" size="small" style={{ width: "100%" }}>
              <Typography.Title level={5} style={{ marginTop: 0 }}>
                Profile Information
              </Typography.Title>

              <InfoRow label="Full name" value={`${firstName} ${lastName}`} />
              <InfoRow label="Email" value={email} />
              <InfoRow label="Gender" value={gender || "Not set"} />
              <InfoRow label="Age" value={age ? String(age) : "Not set"} />
            </Space>
          </Card>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Link href="/settings/"> 
              <Button type="primary" icon={<FiEdit3 />} style={{ background: "#6F826A", border: "none" }}>
                Edit profile
              </Button>
            </Link>
          </div>
        </Space>
      </Card>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "160px 1fr",
      alignItems: "center",
      gap: 12,
      padding: "8px 0",
      borderBottom: "1px solid #f0f0f0",
    }}>
      <Typography.Text strong style={{ color: "#6F826A" }}>
        {label}
      </Typography.Text>
      <Typography.Text>{value}</Typography.Text>
    </div>
  );
}