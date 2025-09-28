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

  return <SignUp fullPage />;
}
