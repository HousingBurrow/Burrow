"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  Card,
  Typography,
  message,
  Space,
  Alert,
} from "antd";
import { useMutation } from "@tanstack/react-query";
import { createUser } from "@/lib/queries/users";
import { useCurrentUser } from "@/lib/stack";

const { Title, Text } = Typography;

interface AccountFormValues {
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  age: number;
}

interface AccountInformationPageProps {
  initialEmail: string;
}

export default function AccountInformationPage({
  initialEmail,
}: AccountInformationPageProps) {
  const [form] = Form.useForm();
  const router = useRouter();
  const user = useCurrentUser();

  const [emailVerified, setEmailVerified] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [currentEmail, setCurrentEmail] = useState(initialEmail);

  useEffect(() => {
    form.setFieldsValue({ gender: "other", email: initialEmail });
    setCurrentEmail(initialEmail);
  }, [form, initialEmail]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const sendVerificationMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await fetch("/api/verify/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to send verification code");
      }
      return data;
    },
    onSuccess: () => {
      message.success("Verification code sent to your email!");
      setVerificationSent(true);
      setCountdown(60); // 60 second cooldown
    },
    onError: (error: Error) => {
      console.log("Send verification error:", error);
      message.error(error.message);
    },
  });

  const verifyCodeMutation = useMutation({
    mutationFn: async ({ email, code }: { email: string; code: string }) => {
      const response = await fetch("/api/verify/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Invalid verification code");
      }
      return data;
    },
    onSuccess: () => {
      message.success("Email verified successfully!");
      setEmailVerified(true);
    },
    onError: (error: Error) => {
      message.error(error.message);
    },
  });

  const createUserMutation = useMutation({
    mutationFn: async (values: AccountFormValues) => {
      console.log("Creating user, current user:", user);

      if (!user || !user.id) {
        throw new Error("No user authenticated. Please sign in again.");
      }

      const response = await createUser({
        email: user.primaryEmail ?? values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        gender: values.gender,
        age: Number(values.age),
        pfp: "",
        authId: user.id,
      });

      if (response.isError) {
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: () => {
      console.log("User created successfully");
      router.push("/");
    },
    onError: (error: Error) => {
      message.error(error.message || "Failed to create user");
      console.error("Error creating user:", error);
    },
  });

  const handleSendVerification = () => {
    const email = form.getFieldValue("email");
    if (!email) {
      message.error("Please enter your email first");
      return;
    }
    setCurrentEmail(email);
    sendVerificationMutation.mutate(email);
  };

  const handleVerifyCode = () => {
    if (!verificationCode) {
      message.error("Please enter the verification code");
      return;
    }
    verifyCodeMutation.mutate({ email: currentEmail, code: verificationCode });
  };

  const handleSubmit = async (values: AccountFormValues) => {
    console.log(values);
    console.log(user);
    if (!emailVerified) {
      message.error("Please verify your email first");
      return;
    }
    createUserMutation.mutate(values);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 50 }}>
      <Card style={{ width: 450, padding: 20 }}>
        <Title level={3} style={{ textAlign: "center", marginBottom: 20 }}>
          Account Information
        </Title>

        {!user && (
          <Alert
            message="Loading user information..."
            type="info"
            showIcon
            style={{ marginBottom: 20 }}
          />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ gender: "other", email: initialEmail }}
        >
          {/* Email Verification Section */}
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input
              placeholder="Enter your student email"
              disabled={emailVerified}
            />
          </Form.Item>

          {!emailVerified && (
            <Space
              direction="vertical"
              style={{ width: "100%", marginBottom: 20 }}
            >
              <Button
                type="primary"
                onClick={handleSendVerification}
                loading={sendVerificationMutation.isPending}
                disabled={countdown > 0}
                block
              >
                {countdown > 0
                  ? `Resend in ${countdown}s`
                  : verificationSent
                  ? "Resend Verification Code"
                  : "Send Verification Code"}
              </Button>

              {verificationSent && (
                <>
                  <Input
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    maxLength={6}
                    style={{
                      textAlign: "center",
                      fontSize: 20,
                      letterSpacing: 5,
                    }}
                  />
                  <Button
                    type="primary"
                    onClick={handleVerifyCode}
                    loading={verifyCodeMutation.isPending}
                    block
                  >
                    Verify Code
                  </Button>
                </>
              )}
            </Space>
          )}

          {emailVerified && (
            <Alert
              message="Email Verified"
              description="Your email has been successfully verified!"
              type="success"
              showIcon
              style={{ marginBottom: 20 }}
            />
          )}

          {/* Rest of the form - enabled after verification */}
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[
              { required: true, message: "Please input your first name!" },
            ]}
          >
            <Input placeholder="Enter first name" />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[
              { required: true, message: "Please input your last name!" },
            ]}
          >
            <Input placeholder="Enter last name" />
          </Form.Item>

          <Form.Item
            label="Gender"
            name="gender"
            rules={[{ required: true, message: "Please select your gender!" }]}
          >
            <Select>
              <Select.Option value="male">Male</Select.Option>
              <Select.Option value="female">Female</Select.Option>
              <Select.Option value="other">Other</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Age"
            name="age"
            rules={[{ required: true, message: "Please input your age!" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              max={120}
              placeholder="Enter age"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              disabled={!emailVerified || !user}
              loading={createUserMutation.isPending}
            >
              {!user ? "Loading..." : "Submit"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
