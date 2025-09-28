"use client";

import ListingCard from "@/components/home/listing-card";
import ListingModal from "@/components/home/listing-modal";
import { getListingById } from "@/lib/queries/listings";
import { AppListing } from "@/lib/schemas";
import { useQuery } from "@tanstack/react-query";
import { Col, Row, Typography, Spin } from "antd";
import { useState } from "react";

const { Title, Text } = Typography;

export default function MyListingsPage() {
  const { isLoading, data, isError } = useQuery({
    queryKey: ["listing", 1],
    queryFn: async () => {
      const response = await getListingById(1);
      if (response.isError) {
        return null;
      }
      return response.data;
    },
  });

  const listings = data ? [data] : [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<AppListing | null>(
    null
  );

  const showModal = (listing: AppListing) => {
    setSelectedListing(listing);
    setIsModalOpen(true);
  };

  const handleCancel = () => setIsModalOpen(false);

  if (isLoading) return <Spin tip="Loading listings..." />;

  if (isError) return <Text type="danger">Failed to load listings.</Text>;

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>My Saved Listings</Title>

      {listings.length === 0 ? (
        <Text type="secondary">You have not saved any listings yet.</Text>
      ) : (
        <Row gutter={[16, 16]} style={{ padding: "32px 0" }}>
          {listings.map((listing) => (
            <Col key={listing.id} xs={24} sm={12} md={8} lg={6}>
              <ListingCard
                listing={{
                  title: listing.title,
                  location: listing.location,
                  price: Number(listing.price),
                  imageUrl: listing.imageUrls[0],
                }}
                onCardClick={() => showModal(listing)}
              />
            </Col>
          ))}
        </Row>
      )}

      {selectedListing && (
        <ListingModal
          isOpen={isModalOpen}
          onClose={handleCancel}
          selectedListing={selectedListing}
        />
      )}
    </div>
  );
}
