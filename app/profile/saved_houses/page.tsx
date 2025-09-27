'use client'

import { Typography, Row, Col, Card, Button, Modal } from 'antd'
import ListingCard from "@/components/ui/listing-card";
import React, { useState, FC } from "react";

const { Title, Text } = Typography

export default function MyListingsPage() {
  // Replace this with real data later
  const listings = [
   {
     id: 1,
     title: "Cozy dorm near campus",
     price: "$500/month",
     location: "Georgia Tech",
     availableRooms: 1,
     totalRooms: 3,
     propertyType: "Dorm",
     utilitiesIncluded: true,
     squareFeet: 350,
     description: "A cozy dorm located very close to campus.",
     images: [
       "https://via.placeholder.com/600x400",
       "https://via.placeholder.com/600x401",
       "https://via.placeholder.com/600x402",
     ],
   },
   {
     id: 5,
     title: "Modern apartment",
     price: "$1000/month",
     location: "Midtown",
     availableRooms: 2,
     totalRooms: 4,
     propertyType: "Apartment",
     utilitiesIncluded: false,
     squareFeet: 350,
     description: "Nice apartment located right next to Publix!",
     images: [
       "https://via.placeholder.com/600x400",
       "https://via.placeholder.com/600x401",
       "https://via.placeholder.com/600x402",
     ],
   },
 ];

  const [isModalOpen, setIsModalOpen] = useState(false);
   const [selectedListing, setSelectedListing] = useState<
     (typeof listings)[0] | null
   >(null);
  
  
   const showModal = (listing: (typeof listings)[0]) => {
     setSelectedListing(listing);
     setIsModalOpen(true);
   };
  
  
   const handleOk = () => setIsModalOpen(false);
   const handleCancel = () => setIsModalOpen(false);

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>My Saved Listings</Title>

      {listings.length === 0 ? (
        <Text type="secondary">You have not saved any listings yet.</Text>
      ) : (
        <Row gutter={[16, 16]} style={{ padding: "32px" }}>
          {listings.map((listing) => (
            <Col key={listing.id} xs={24} sm={12} md={8} lg={6}>
              <ListingCard
                {...listing}
                image={listing.images[0]}
                onViewDetails={() => showModal(listing)}
              />
            </Col>
          ))}
        </Row>
      )}

      {/* Modal */}
      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width="90%"
        style={{ top: "5%", padding: 0 }}
        bodyStyle={{ padding: 0, overflow: "hidden" }}
        footer={null}
      >
        <div style={{ display: "flex", height: "80vh" }}>
          {/* Left side: Scrollable images */}
          <div
            style={{
              width: "60%",
              height: "100%",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              padding: "8px",
            }}
          >
            {selectedListing?.images?.map((img: string, idx: number) => (
              <img
                key={idx}
                src={img}
                alt={`${selectedListing.title} - ${idx + 1}`}
                style={{
                  width: "100%",
                  height: "80%",
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
            ))}
          </div>

          {/* Right side: Listing details */}
          <div
            style={{
              width: "40%",
              padding: "32px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <div>
              <h1 style={{ margin: 0, fontSize: "28px" }}>
                {selectedListing?.title}
              </h1>
              <Text strong style={{ fontSize: 20, color: "#222" }}>
                {selectedListing?.price}
              </Text>
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
                borderBottom: "1px solid #eee",
                paddingBottom: 16,
              }}
            >
              <Text>
                <strong>Rooms:</strong> {selectedListing?.availableRooms} /{" "}
                {selectedListing?.totalRooms}
              </Text>
              <Text>
                <strong>Property Type:</strong> {selectedListing?.propertyType}
              </Text>
              <Text>
                <strong>Square Footage:</strong> {selectedListing?.squareFeet} sqft
              </Text>
            </div>

            <div style={{ borderBottom: "1px solid #eee", paddingBottom: 16 }}>
              <Text>
                <strong>Location:</strong> {selectedListing?.location}
              </Text>
            </div>

            <div style={{ borderBottom: "1px solid #eee", paddingBottom: 16 }}>
              <Text>
                <strong>Utilities Included:</strong>{" "}
                {selectedListing?.utilitiesIncluded ? "Yes" : "No"}
              </Text>
            </div>

            <div>
              <Text strong>Description:</Text>
              <p style={{ marginTop: 8, lineHeight: 1.6 }}>
                {selectedListing?.description}
              </p>
            </div>

            <Button
              type="primary"
              style={{ marginTop: "auto", padding: "12px 24px", fontSize: 16 }}
              onClick={() => alert("Contact Leaser!")}
            >
              Contact Leaser
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}