"use client";

import ListingCard from "@/components/home/listing-card";
import ListingModal from "@/components/home/listing-modal";
import { SearchBar } from "@/components/home/search-bar";
import { getListingById } from "@/lib/queries/listings";
import { AppListing } from "@/lib/schemas";
import { useQuery } from "@tanstack/react-query";
import { Col, Row } from "antd";
import { useState } from "react";

export default function HomePage() {
  const { isLoading, data } = useQuery({
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

  const handleOk = () => setIsModalOpen(false);
  const handleCancel = () => setIsModalOpen(false);

  return (
    <div style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      {/* Search bar */}
      <Row justify="center" style={{ padding: "32px" }}>
        <Col>
          <SearchBar onSearchClicked={(val) => console.log(val)} />
        </Col>
      </Row>

      {/* Listings */}
      <Row gutter={[16, 16]} style={{ padding: "32px" }}>
        {listings.map((listing) => (
          <Col key={listing.id} xs={24} sm={12} md={8} lg={6}>
            <ListingCard
              listing={{
                title: listing.title,
                location: listing.location,
                price: Number(listing.price),
                imageUrl: listing.imageUrls[0],
              }}
              onViewDetails={() => showModal(listing)}
            />
          </Col>
        ))}
      </Row>

      {selectedListing && (
        <ListingModal
          isOpen={isModalOpen}
          handleCancel={handleCancel}
          handleOk={handleOk}
          selectedListing={selectedListing}
        />
      )}
    </div>
  );
}