"use client";

import React, { useState, useTransition, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  Switch,
  Button,
  Avatar,
  Typography,
  Card,
  message,
  Tabs,
  Space,
  Row,
  Col,
} from "antd";
import {
  FiUser,
  FiSettings,
  FiBell,
  FiShield,
  FiCamera,
  FiTrash2,
} from "react-icons/fi";
import { updateUser, deleteUser } from "@/lib/queries/users";
import { signOut } from "next-auth/react";
import "./settings.css";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

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

  // ------------------- Handle input changes -------------------
  const handleInputChange = <K extends keyof SettingsState>(
    key: K,
    value: SettingsState[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
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
      });

      if (res.isError) message.error(res.message || "Failed to save changes");
      else message.success("Settings saved successfully");
    });
  };

  // ------------------- Delete user -------------------
  const handleDelete = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete your account? This action is irreversible."
    );
    if (!confirm) return;

    const res = await deleteUser(userId);
    if (res.isError) message.error(res.message || "Failed to delete account");
    else {
      message.success("Account deleted successfully");
      await signOut({ callbackUrl: "/" });
    }
  };
  
  return (
    <div style={{ minHeight: "100vh", padding: 32 }}>
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
          tabBarStyle={{ marginBottom: 32, fontWeight: 600 }}
          centered
        >
          {/* PROFILE */}
          <TabPane
            tab={
              <Space>
                <FiUser />
                Profile
              </Space>
            }
            key="profile"
          >
            <Card
              style={{
                borderRadius: 16,
                padding: 24,
                marginBottom: 24,
              }}
            >
              <Row gutter={24} align="middle">
                <Col>
                  <div className="avatar-hover">
                    <Avatar
                      size={100}
                      style={{ backgroundColor: "#1890ff", fontSize: 32 }}
                    >
                      {formData.firstName[0]?.toUpperCase() || "U"}
                      {formData.lastName[0]?.toUpperCase() || ""}
                    </Avatar>
                    <div className="avatar-overlay">
                      <FiCamera size={24} color="#fff" />
                    </div>
                  </div>
                </Col>
                <Col flex="auto">
                  <Text style={{ fontSize: 14, color: "#595959" }}>
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
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
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
            </Card>
          </TabPane>

          {/* PREFERENCES */}
          <TabPane
            tab={
              <Space>
                <FiSettings />
                Preferences
              </Space>
            }
            key="preferences"
          >
            <Card style={{ borderRadius: 16, padding: 24 }}>
              <Form layout="vertical">
                <Form.Item label="Dark Mode" valuePropName="checked">
                  <Switch
                    checked={formData.darkMode}
                    onChange={(checked) =>
                      handleInputChange("darkMode", checked)
                    }
                    size="small"
                  />
                </Form.Item>

                <Form.Item label="Default Search Location">
                  <Select
                    value={formData.defaultLocation}
                    onChange={(val) =>
                      handleInputChange("defaultLocation", val)
                    }
                    options={locations.map((l) => ({ label: l, value: l }))}
                    placeholder="Select location"
                    size="large"
                  />
                </Form.Item>
              </Form>
            </Card>
          </TabPane>

          {/* NOTIFICATIONS */}
          <TabPane
            tab={
              <Space>
                <FiBell />
                Notifications
              </Space>
            }
            key="notifications"
          >
            <Card style={{ borderRadius: 16, padding: 24 }}>
              <Form.Item label="Email Notifications" valuePropName="checked">
                <Switch
                  checked={formData.notifications}
                  onChange={(checked) =>
                    handleInputChange("notifications", checked)
                  }
                  size="small"
                />
              </Form.Item>
            </Card>
          </TabPane>

          {/* PRIVACY */}
          <TabPane
            tab={
              <Space>
                <FiShield />
                Privacy
              </Space>
            }
            key="privacy"
          >
            <Card
              type="inner"
              title="Danger Zone"
              style={{
                borderColor: "#ff4d4f",
                borderWidth: 1,
                borderStyle: "solid",
                borderRadius: 16,
              }}
            >
              <Text style={{ color: "#ff4d4f" }}>
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
          </TabPane>
        </Tabs>

        <div style={{ textAlign: "right", marginTop: 32 }}>
          <Space>
            <Button disabled={saving}>Cancel</Button>
            <Button
              type="primary"
              onClick={handleSave}
              loading={saving}
              style={{
                background: "linear-gradient(90deg, #1890ff, #40a9ff)",
                border: "none",
              }}
            >
              Save Changes
            </Button>
          </Space>
        </div>
      </Card>
    </div>
  );
}
