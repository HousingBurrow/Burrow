"use client";

import Link from "next/link";
import React, { useState, FC } from "react";
import {
  Input,
  Button,
  Select,
  DatePicker,
  Row,
  Col,
  Card,
  Typography,
  Space,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { Dayjs } from "dayjs";

const { RangePicker } = DatePicker;
const { Text, Title } = Typography;

export const SearchBar: FC = () => {
  const [location, setLocation] = useState<string | undefined>();
  const [dates, setDates] = useState<[Dayjs, Dayjs] | null>(null);
  const [rooms, setRooms] = useState<number | undefined>();

  const locations = ["Midtown", "North Avenue", "Home Park", "West Midtown"];

  const handleSearch = () => {
    console.log({ location, dates, rooms });
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        background: "#fff",
        borderRadius: 999,
        padding: "8px 12px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        gap: 8,
        minWidth: 600,
      }}
    >
      {/* Location */}
      <Select
        placeholder="Where"
        value={location}
        onChange={setLocation}
        style={{ minWidth: 150, borderRadius: 999 }}
      >
        {locations.map((loc) => (
          <Select.Option key={loc} value={loc}>
            {loc}
          </Select.Option>
        ))}
      </Select>

      {/* Date Range */}
      <RangePicker
        value={dates}
        onChange={(val) => setDates(val as [Dayjs, Dayjs])}
        style={{ borderRadius: 999 }}
      />

      {/* Rooms */}
      <Input
        type="number"
        min={1}
        placeholder="Rooms"
        value={rooms}
        onChange={(e) => setRooms(Number(e.target.value))}
        style={{ width: 100, borderRadius: 999 }}
      />

      {/* Search Button */}
      <Button
        type="primary"
        icon={<SearchOutlined />}
        onClick={handleSearch}
        style={{ borderRadius: 999 }}
      >
        Search
      </Button>
    </div>
  );
};

export default function HomePage() {
  const listings = [
    {
      id: 1,
      title: "Cozy dorm near campus",
      location: "Georgia Tech",
      price: "$500/month",
      image: "https://via.placeholder.com/300x200",
    },
    {
      id: 2,
      title: "Spacious apartment",
      location: "Atlanta",
      price: "$1200/month",
      image: "https://via.placeholder.com/300x200",
    },
    {
      id: 3,
      title: "Private room in a house",
      location: "Downtown",
      price: "$700/month",
      image: "https://via.placeholder.com/300x200",
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      {/* Header */}
      <Row
        justify="space-between"
        align="middle"
        style={{ background: "#fff", padding: "16px 32px" }}
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

      {/* Search bar */}
      <Row justify="center" style={{ marginTop: 32, width: "2000" }}>
        <Col>
          <SearchBar />
        </Col>
      </Row>

      {/* Listings */}
      <Row gutter={[16, 16]} style={{ padding: "32px" }}>
        {listings.map((listing) => (
          <Col key={listing.id} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              cover={<img alt={listing.title} src={listing.image} />}
            >
              <Title level={5}>{listing.title}</Title>
              <Text type="secondary">{listing.location}</Text>
              <br />
              <Text strong>{listing.price}</Text>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
