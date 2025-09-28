"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Select, InputNumber, Button, Card, Typography, message } from "antd";
import { useMutation } from "@tanstack/react-query";
import { createUser } from "@/lib/queries/users";
import { initial } from "lodash";

const { Title } = Typography;

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

export default function AccountInformationPage({ initialEmail }: AccountInformationPageProps) {
  const [form] = Form.useForm();
  const router = useRouter();

  useEffect(() => {
    form.setFieldsValue({ gender: "other", email: initialEmail });
  }, [form, initialEmail]);

  const handleSubmit = async (values: AccountFormValues) => {
    createUserMutation.mutate(values)
  };

  const createUserMutation = useMutation({
    mutationFn: async (values: AccountFormValues) => {
      const response = await createUser({
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        gender: values.gender,
        age: Number(values.age),
      })

      if (response.isError) {
        message.error("Failed to create user.");
        throw new Error(response.message);
      }
    },
    onSuccess: () => {
      console.log("User created successfully");
      router.push("/")
    },
    onError: () => {
      console.error("Error creating user");
    }
  })

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 50 }}>
      <Card style={{ width: 400, padding: 20 }}>
        <Title level={3} style={{ textAlign: "center", marginBottom: 20 }}>
          Account Information
        </Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ gender: "other", email: initialEmail }}
        >
          <Form.Item label="Email" name="email" rules={[{ required: true, message: "Please input your email!" }]}>
            <Input placeholder="Enter email" />
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
