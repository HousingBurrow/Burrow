'use client'

import { Typography, Row, Col, Card, Button } from 'antd'

const { Title, Text } = Typography

export default function MyListingsPage() {
  // Replace this with real data later
  const listings = [
    {
      id: 1,
      title: 'Sunny Apartment near Campus',
      location: 'Atlanta, GA',
      price: '$700/month',
      image: 'https://via.placeholder.com/600x400?text=Listing+1',
    },
    {
      id: 2,
      title: 'Shared House with Garden',
      location: 'Atlanta, GA',
      price: '$450/month',
      image: 'https://via.placeholder.com/600x400?text=Listing+2',
    },
  ]

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>My Listings</Title>

      {listings.length === 0 ? (
        <Text type="secondary">You have not created any listings yet.</Text>
      ) : (
        <Row gutter={[16, 16]}>
          {listings.map((l) => (
            <Col key={l.id} xs={24} sm={12} lg={8}>
              <Card
                hoverable
                cover={
                  <img
                    src={l.image}
                    alt={l.title}
                    style={{ height: 180, width: '100%', objectFit: 'cover' }}
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
                <Button type="primary" block style={{ marginTop: 12 }}>
                  View Details
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  )
}
