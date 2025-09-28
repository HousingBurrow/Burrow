"use client";
import { useCurrentUser } from "@/lib/stack";
import { SignUp, useStackApp } from "@stackframe/stack";
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

  const handleSignUp = async (values: { email: string; password: string }) => {
    setError("");
    setIsLoading(true);
    try {
      if (!validateEmailDomain(values.email)) {
        throw new Error(
          `Email domain not allowed. Please use: ${allowedDomains.join(", ")}`
        );
      }
      await app.signUpWithCredential(values);
    } catch (err) {
      setError((err as Error).message || "Sign-up failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignUp = async (provider: "google" | "github") => {
    setError("");
    setIsLoading(true);
    try {
      await app.signInWithOAuth(provider); // OAuth flow same for sign-up
    } catch (err) {
      setError(
        (err as Error).message || "OAuth sign-up failed. Please try again."
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
        backgroundColor: "#DCCFC0",
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
            Sign up for an account
          </Title>
          <Text type="secondary">
            Already have an account?{" "}
            <Link onClick={() => router.push("/auth/sign-in")}>Sign in</Link>
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
            onClick={() => handleOAuthSignUp("github")}
            loading={isLoading}
            style={{ background: "#000", color: "#fff" }}
          >
            Sign up with GitHub
          </Button>

          <Button
            block
            size="large"
            icon={<GoogleOutlined />}
            onClick={() => handleOAuthSignUp("google")}
            loading={isLoading}
          >
            Sign up with Google
          </Button>
        </Space>

        <Divider plain>Or continue with</Divider>

        {/* Sign Up Form */}
        <Form layout="vertical" onFinish={handleSignUp} requiredMark={false}>
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

          <Form.Item>
            <Button
              block
              type="default"
              size="large"
              htmlType="submit"
              loading={isLoading}
            >
              Sign Up
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
