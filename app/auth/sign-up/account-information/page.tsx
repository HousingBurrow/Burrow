"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CurrentUser } from "@stackframe/stack";
import { createUser } from "@/lib/queries/users";
import { Form, Input, Select, InputNumber, Button, Card, Typography, message } from "antd";
import { email } from "zod";

const { Title } = Typography;

interface ExtendedCurrentUser extends CurrentUser {
  email?: string; 
}

export default function AccountInformationPage({ user }: { user: ExtendedCurrentUser | null }) {
  const [form] = Form.useForm();
  const router = useRouter();

  const initialEmail = user?.email ?? ""; 

  useEffect(() => {
    if (user) {
      form.setFieldsValue({ email: initialEmail });
    }
  }, [user, form, initialEmail]);

  const handleSubmit = async (values: {
    firstName: string;
    lastName: string;
    gender: string;
    age: number;
  }) => {
    const result = await createUser({
      email: initialEmail,
      firstName: values.firstName,
      lastName: values.lastName,
      gender: values.gender,
      age: Number(values.age),
    });

    if (result.isError) {
      console.error("Error creating user:", result.message);
      message.error("Failed to create user.");
    } else {
      message.success("User created successfully!");
      router.push("../../"); // redirect after success
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
      <Card style={{ width: 400, padding: "20px" }}>
        <Title level={3} style={{ textAlign: "center", marginBottom: "20px" }}>
          Account Information
        </Title>
        <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ gender: "Not Selected Yet", email: initialEmail }}>
          <Form.Item label="Email" name="email">
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="First Name"
            name="firstName"
            rules={[{ required: true, message: "Please input your first name!" }]}
          >
            <Input placeholder="Enter first name" />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[{ required: true, message: "Please input your last name!" }]}
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
            <InputNumber style={{ width: "100%" }} min={0} max={120} placeholder="Enter age" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
