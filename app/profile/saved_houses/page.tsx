'use client'

import { Card, Row, Col, Typography, Button, Empty } from 'antd'
import Image from 'next/image'

export default function SavedHousesPage() {
  // Replace with real data later
  const houses = [
    {
      id: 1,
      title: 'Modern Apartment in the City',
      location: 'New York, NY',
      image: 'https://via.placeholder.com/800x500.png?text=House+1',
    },
    {
      id: 2,
      title: 'Cozy Cabin in the Woods',
      location: 'Aspen, CO',
      image: 'https://via.placeholder.com/800x500.png?text=House+2',
    },
    {
      id: 3,
      title: 'Beachfront Villa',
      location: 'Miami, FL',
      image: 'https://via.placeholder.com/800x500.png?text=House+3',
    },
  ]

  return (
    <div style={{ padding: '24px' }}>
      <Typography.Title level={3}>Saved Houses</Typography.Title>

      {houses.length === 0 ? (
        <Empty description="You haven’t saved any houses yet." />
      ) : (
        <Row gutter={[16, 16]}>
          {houses.map((h) => (
            <Col key={h.id} xs={24} sm={12} lg={8}>
                <Card
                hoverable
                cover={
                    <img
                    src={h.image}
                    alt={h.title}
                    style={{ objectFit: 'cover', height: 180, width: '100%' }}
                    />
                }
                >
                <Card.Meta
                  title={h.title}
                  description={h.location}
                />
                <Button type="primary" block style={{ marginTop: 12 }}>
                  View details
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  )
}
