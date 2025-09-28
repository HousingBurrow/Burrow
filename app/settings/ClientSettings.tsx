"use client";

import React, { useState, useTransition } from "react";
import {
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Row,
  Select,
  Space,
  Switch,
  Tabs,
  Typography,
  Upload,
} from "antd";
import {
  FiBell,
  FiCamera,
  FiSettings,
  FiShield,
  FiTrash2,
  FiUser,
  PlusOutlined,
} from "react-icons/fi";
import { updateUser, deleteUser } from "@/lib/queries/users";
import "./settings.css";
import { useUser } from "@stackframe/stack";

const { Title, Text } = Typography;

const genders = ["Male", "Female", "Other", "Prefer not to say"] as const;
type Gender = (typeof genders)[number];

const locations = ["Midtown", "WestMidtown", "HomePark", "NorthAvenue"] as const;
type DefaultLocation = (typeof locations)[number];

type SettingsState = {
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  gender: Gender;
  notifications: boolean;
  darkMode: boolean;
  defaultLocation: DefaultLocation;
  pfp?: string; // profile picture URL or base64 preview
};

export default function ClientSettings({
  userId,
  initial,
}: {
  userId: number;
  initial: SettingsState;
}) {
  const [formData, setFormData] = useState<SettingsState>(initial);
  const [saving, startTransition] = useTransition();
  const [msgApi, contextHolder] = message.useMessage();
  const user = useUser();

  // ------------------- Handle input changes -------------------
  const handleInputChange = <K extends keyof SettingsState>(
    key: K,
    value: SettingsState[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // ------------------- Profile picture upload -------------------
  const handleAvatarUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      handleInputChange("pfp", reader.result as string); // save preview as base64
    };
    reader.readAsDataURL(file);
    return false; // prevent automatic upload
  };

  // ------------------- Save user data -------------------
  const handleSave = () => {
    startTransition(async () => {
      const res = await updateUser({
        id: userId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        age: formData.age,
        gender: formData.gender,
        pfp: formData.pfp, // save profile picture
      });

      if (res.isError) msgApi.error(res.message || "Failed to save changes");
      else msgApi.success("Settings saved successfully");
    });
  };

  const handleDelete = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete your account? This action is irreversible."
    );
    if (!confirm) return;

    try {
      const res = await deleteUser(userId);

      if (res.isError) {
        msgApi.error(res.message || "Failed to delete account");
        return;
      }

      msgApi.success("Account deleted successfully");

      if (user) {
        await user.signOut();
      }

      setTimeout(() => {
        window.location.replace("/");
      }, 100);
    } catch (error) {
      console.error("Error during account deletion:", error);
      msgApi.error("An error occurred while deleting your account");

      setTimeout(() => {
        window.location.replace("/");
      }, 1000);
    }
  };

  // ------------------- Tabs content -------------------
  const profileTab = (
    <>
      <Card style={{ borderRadius: 16, padding: 24, marginBottom: 24 }}>
        <Row gutter={24} align="middle">
          <Col>
            <Upload
              showUploadList={false}
              beforeUpload={handleAvatarUpload}
              accept="image/*"
            >
              <div className="avatar-hover">
                <Avatar
                  size={100}
                  src={formData.pfp}
                  style={{ backgroundColor: "#6F826A", fontSize: 32 }}
                >
                  {!formData.pfp &&
                    `${formData.firstName[0]?.toUpperCase() || "U"}${
                      formData.lastName[0]?.toUpperCase() || ""
                    }`}
                </Avatar>
                <div className="avatar-overlay">
                  <FiCamera size={24} color="#fff" />
                </div>
              </div>
            </Upload>
          </Col>
          <Col flex="auto">
            <Text style={{ fontSize: 14, color: "#6F826A" }}>
              Upload a new profile picture. JPG, PNG, or GIF. Max 2MB.
            </Text>
          </Col>
        </Row>
      </Card>

      <Card style={{ borderRadius: 16, padding: 24 }}>
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="First Name">
                <Input
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  placeholder="Enter first name"
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Last Name">
                <Input
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  placeholder="Enter last name"
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={16}>
              <Form.Item label="Email">
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter email"
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Age">
                <Input
                  type="number"
                  value={formData.age}
                  onChange={(e) =>
                    handleInputChange("age", Number(e.target.value))
                  }
                  placeholder="Age"
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Gender">
            <Select
              value={formData.gender}
              onChange={(val) => handleInputChange("gender", val)}
              options={genders.map((g) => ({ label: g, value: g }))}
              placeholder="Select gender"
              size="large"
            />
          </Form.Item>
        </Form>

        <div style={{ textAlign: "right", marginTop: 32 }}>
          <Space>
            <Button onClick={() => setFormData(initial)} disabled={saving}>
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={handleSave}
              loading={saving}
              style={{
                background: "#6F826A",
                border: "none",
              }}
            >
              Save Changes
            </Button>
          </Space>
        </div>
      </Card>
    </>
  );

  const preferencesTab = (
    <Card style={{ borderRadius: 16, padding: 24 }}>
      <Form layout="vertical">
        <Form.Item label="Dark Mode" valuePropName="checked">
          <Switch
            checked={formData.darkMode}
            onChange={(checked) => handleInputChange("darkMode", checked)}
            size="small"
          />
        </Form.Item>

        <Form.Item label="Default Search Location">
          <Select
            value={formData.defaultLocation}
            onChange={(val) => handleInputChange("defaultLocation", val)}
            options={locations.map((l) => ({ label: l, value: l }))}
            placeholder="Select location"
            size="large"
          />
        </Form.Item>
      </Form>
    </Card>
  );

  const notificationsTab = (
    <Card style={{ borderRadius: 16, padding: 24 }}>
      <Form.Item label="Email Notifications" valuePropName="checked">
        <Switch
          checked={formData.notifications}
          onChange={(checked) => handleInputChange("notifications", checked)}
          size="small"
        />
      </Form.Item>
    </Card>
  );

  const privacyTab = (
    <Card
      type="inner"
      title="Danger Zone"
      style={{
        borderColor: "#9A3F3F",
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: 16,
      }}
    >
      <Text style={{ color: "#9A3F3F" }}>
        Deleting your account is irreversible.
      </Text>
      <div style={{ textAlign: "right", marginTop: 16 }}>
        <Button
          type="primary"
          danger
          icon={<FiTrash2 />}
          onClick={handleDelete}
        >
          Delete Account
        </Button>
      </div>
    </Card>
  );

  // Tabs items (AntD 5)
  const tabItems = [
    {
      key: "profile",
      label: (
        <Space>
          <FiUser />
          Profile
        </Space>
      ),
      children: profileTab,
    },
    {
      key: "preferences",
      label: (
        <Space>
          <FiSettings />
          Preferences
        </Space>
      ),
      children: preferencesTab,
    },
    {
      key: "notifications",
      label: (
        <Space>
          <FiBell />
          Notifications
        </Space>
      ),
      children: notificationsTab,
    },
    {
      key: "privacy",
      label: (
        <Space>
          <FiShield />
          Privacy
        </Space>
      ),
      children: privacyTab,
    },
  ];

  return (
    <div style={{ minHeight: "100vh", padding: 32 }}>
      {contextHolder}
      <Card
        style={{
          maxWidth: 900,
          margin: "0 auto",
          borderRadius: 24,
          padding: 32,
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          background: "linear-gradient(180deg, #ffffff 0%, #fafafa 100%)",
        }}
      >
        <Title level={2} style={{ marginBottom: 32, textAlign: "center" }}>
          Account Settings
        </Title>

        <Tabs
          defaultActiveKey="profile"
          type="card"
          centered
          tabBarStyle={{ marginBottom: 32, fontWeight: 600 }}
          items={tabItems}
        />
      </Card>
    </div>
  );
}
