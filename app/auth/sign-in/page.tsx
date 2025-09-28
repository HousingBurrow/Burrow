"use client";
import { useCurrentUser } from "@/lib/stack";
import { useStackApp } from "@stackframe/stack";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Divider, Form, Input, Typography, Alert, Space } from "antd";
import {
  GithubOutlined,
  GoogleOutlined,
  MailOutlined,
  LockOutlined,
} from "@ant-design/icons";

const { Title, Text, Link } = Typography;

export default function Page() {
  const app = useStackApp();
  const user = useCurrentUser();
  const router = useRouter();

  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Allowed domains
  const allowedDomains: string[] = ["gatech.edu"];

  const validateEmailDomain = (email: string): boolean => {
    const domain = email.split("@")[1]?.toLowerCase();
    return allowedDomains.some(
      (allowed) => domain === allowed || domain?.endsWith(`.${allowed}`)
    );
  };

  useEffect(() => {
    if (!user) return;
    const domain = user?.primaryEmail?.split("@")[1]?.toLowerCase();
    if (
      !domain ||
      (user.primaryEmail && !validateEmailDomain(user.primaryEmail))
    ) {
      setError(
        `Email domain not allowed. Allowed: ${allowedDomains.join(", ")}`
      );
      user?.signOut();
      return;
    }
    router.push("/account-information");
  }, [user, router, app]);

  const handleSignIn = async (values: { email: string; password: string }) => {
    setError("");
    setIsLoading(true);
    try {
      if (!validateEmailDomain(values.email)) {
        throw new Error(
          `Email domain not allowed. Please use: ${allowedDomains.join(", ")}`
        );
      }
      await app.signInWithCredential(values);
    } catch (err) {
      setError((err as Error).message || "Sign-in failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: "google" | "github") => {
    setError("");
    setIsLoading(true);
    try {
      await app.signInWithOAuth(provider);
    } catch (err) {
      setError(
        (err as Error).message || "OAuth sign-in failed. Please try again."
      );
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f3f4f6", // light gray
        height: "85vh",
      }}
    >
      <div
        style={{
          maxWidth: "360px",
          width: "100%",
          background: "transparent",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Title level={3} style={{ marginBottom: 4 }}>
            Sign in to your account
          </Title>
          <Text type="secondary">
            Don’t have an account?{" "}
            <Link onClick={() => router.push("/auth/sign-up")}>Sign up</Link>
          </Text>
        </div>

        {/* Error */}
        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        {/* OAuth Buttons */}
        <Space direction="vertical" style={{ width: "100%", marginBottom: 16 }}>
          <Button
            block
            size="large"
            icon={<GithubOutlined />}
            onClick={() => handleOAuthSignIn("github")}
            loading={isLoading}
            style={{ background: "#000", color: "#fff" }}
          >
            Sign in with GitHub
          </Button>

          <Button
            block
            size="large"
            icon={<GoogleOutlined />}
            onClick={() => handleOAuthSignIn("google")}
            loading={isLoading}
          >
            Sign in with Google
          </Button>
        </Space>

        <Divider plain>Or continue with</Divider>

        {/* Sign In Form */}
        <Form layout="vertical" onFinish={handleSignIn} requiredMark={false}>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <div style={{ marginBottom: 16 }}>
            <Link onClick={() => router.push("/forgot-password")}>
              Forgot password?
            </Link>
          </div>

          <Form.Item>
            <Button
              block
              type="default"
              size="large"
              htmlType="submit"
              loading={isLoading}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
