'use client'

import Link from 'next/link'
import React, { useState } from 'react'
import {
  Layout,
  Typography,
  Space,
  Button,
  Select,
  DatePicker,
  InputNumber,
  Row,
  Col,
  Card,
} from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import dayjs, { Dayjs } from 'dayjs'

const { Header, Content } = Layout
const { Title, Text } = Typography

/* ---------------- Search Bar (antd) ---------------- */
function SearchBar() {
  const [location, setLocation] = useState<string>()
  const [startDate, setStartDate] = useState<Dayjs | null>(null)
  const [endDate, setEndDate] = useState<Dayjs | null>(null)
  const [rooms, setRooms] = useState<number | null>(1)

  const locations = ['Midtown', 'North Avenue', 'Home Park', 'West Midtown']

  const handleSearch = () => {
    console.log({
      location,
      startDate: startDate?.format('YYYY-MM-DD'),
      endDate: endDate?.format('YYYY-MM-DD'),
      rooms,
    })
  }

  return (
    <Space
      size="large"
      style={{
        width: '100%',
        maxWidth: 1000,
        padding: 12,
        borderRadius: 999,
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        justifyContent: 'space-between',
      }}
      wrap
    >
      <div style={{ minWidth: 180 }}>
        <Text strong>Where</Text>
        <Select
          placeholder="Select location"
          value={location}
          onChange={setLocation}
          options={locations.map((l) => ({ label: l, value: l }))}
          style={{ width: '100%', marginTop: 4 }}
          allowClear
        />
      </div>

      <div style={{ minWidth: 180 }}>
        <Text strong>Start date</Text>
        <DatePicker
          value={startDate}
          onChange={setStartDate}
          style={{ width: '100%', marginTop: 4 }}
          disabledDate={(d) => !!endDate && d.isAfter(endDate, 'day')}
        />
      </div>

      <div style={{ minWidth: 180 }}>
        <Text strong>End date</Text>
        <DatePicker
          value={endDate}
          onChange={setEndDate}
          style={{ width: '100%', marginTop: 4 }}
          disabledDate={(d) => !!startDate && d.isBefore(startDate, 'day')}
        />
      </div>

      <div style={{ minWidth: 140 }}>
        <Text strong>Rooms</Text>
        <InputNumber
          min={1}
          value={rooms ?? 1}
          onChange={(v) => setRooms(v ?? 1)}
          style={{ width: '100%', marginTop: 4 }}
        />
      </div>

      <Button
        type="primary"
        icon={<SearchOutlined />}
        onClick={handleSearch}
        style={{ borderRadius: 999 }}
      >
        Search
      </Button>
    </Space>
  )
}

/* ---------------- Home Page (antd) ---------------- */
export default function HomePage() {
  const listings = [
    {
      id: 1,
      title: 'Cozy dorm near campus',
      location: 'Georgia Tech',
      price: '$500/month',
      image: 'https://via.placeholder.com/600x400?text=Listing',
    },
  ]

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Header */}
      <Header
        style={{
          background: '#fff',
          paddingInline: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #f0f0f0',
        }}
      >
        <Typography.Text strong style={{ fontSize: 18 }}>BURROW</Typography.Text>

        <Space>
          <Link href="/profile/about_me">
            <Button type="text">Profile</Button>
          </Link>

          {/* NEW: Add Listing button */}
          <Link href="/profile/my_listings/new">
            <Button type="text">Add Listing</Button>
          </Link>

          <Link href="/settings">
            <Button type="text">Settings</Button>
          </Link>

          <Button type="text">Logout</Button>
        </Space>
      </Header>


      <Content style={{ padding: '32px 24px' }}>
        {/* Search bar */}
        <div style={{ display: 'grid', placeItems: 'center', marginBottom: 24 }}>
          <SearchBar />
        </div>

        {/* Listings */}
        <Row gutter={[16, 16]}>
          {listings.map((l) => (
            <Col key={l.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                cover={
                  <img
                    src={l.image}
                    alt={l.title}
                    style={{ height: 160, width: '100%', objectFit: 'cover' }}
                  />
                }
              >
                <Title level={5} style={{ marginBottom: 4 }}>
                  {l.title}
                </Title>
                <Text type="secondary">{l.location}</Text>
                <div style={{ marginTop: 8 }}>
                  <Text strong>{l.price}</Text>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Content>
    </Layout>
  )
}
