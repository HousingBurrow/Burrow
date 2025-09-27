import { Row, Space, Button } from "antd";
import Title from "antd/es/typography/Title";
import Link from "next/link";

export function Header() {
  return (
    <Row
      style={{
        background: "#fff",
        padding: "16px 32px",
        flexDirection: "row",
        display: "flex",
        justifyContent: "space-between"
      }}
    >
      <Title level={3} style={{ margin: 0 }}>
        BURROW
      </Title>
      <Space>
        <Link href="/profile/about_me">
          <Button type="text">Profile</Button>
        </Link>
        <Button type="text">Settings</Button>
        <Button type="text">Logout</Button>
      </Space>
    </Row>
  );
}
