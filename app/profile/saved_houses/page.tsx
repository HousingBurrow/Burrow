"use client";

import ListingCard from "@/components/home/listing-card";
import ListingModal from "@/components/home/listing-modal";
import { getListingById } from "@/lib/queries/listings";
import {
  getSavedListingsForUser,
  getUserByAuthId,
  toggleSaveListing,
} from "@/lib/queries/users";
import { AppListing } from "@/lib/schemas";
import { useCurrentUser } from "@/lib/stack";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Col, Row, Typography, Spin, Button } from "antd";
import { useMemo, useState } from "react";
import { LuBookmark } from "react-icons/lu";

const { Title, Text } = Typography;

export default function SavedListings() {
  const user = useCurrentUser();

  const { data: dbUser } = useQuery({
    queryKey: ["signedInUser", user?.id],
    queryFn: async () => {
      if (user) {
        const response = await getUserByAuthId(user.id);
        if (response.isError) {
          return undefined;
        }

        return response.data;
      } else {
        return undefined;
      }
    },
    enabled: !!user,
  });

  const {
    data: savedListings = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["savedListings", dbUser?.id],
    queryFn: async () => {
      if (dbUser) {
        const response = await getSavedListingsForUser(dbUser.id);
        if (response.isError) {
          return undefined;
        }
        return response.data;
      } else {
        return undefined;
      }
    },
    enabled: !!dbUser,
  });

  const savedListingsIds = useMemo(
    () => new Set(savedListings.map(({ id }) => id)),
    [savedListings]
  );

  const toggleMutation = useMutation({
    mutationFn: async ({
      userId,
      listingId,
    }: {
      userId: number;
      listingId: number;
    }) => await toggleSaveListing(userId, listingId),
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      console.error("bad stuff happened", error);
    },
  });

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

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>My Listings</Title>

      {!savedListings.length ? (
        <Text type="secondary">No saved listings found.</Text>
      ) : (
        <Row gutter={[16, 16]} style={{ padding: "32px 0" }}>
          {savedListings.map((listing) => (
            <Col key={listing.id} xs={24} sm={12} md={8} lg={6}>
              <ListingCard
                listing={{
                  title: listing.title,
                  location: listing.location,
                  price: Number(listing.price),
                  imageUrl: listing.imageUrls[0],
                }}
                onCardClick={() => showModal(listing)}
                hoverButton={
                  dbUser && savedListingsIds ? (
                    <Button
                      onClick={() => {
                        toggleMutation.mutate({
                          userId: dbUser.id,
                          listingId: listing.id,
                        });
                      }}
                      style={{
                        padding: "0",
                        width: "32px",
                        height: "32px",
                        borderRadius: "calc(infinity * 1px)",
                      }}
                    >
                      <LuBookmark
                        color={
                          savedListingsIds.has(listing.id)
                            ? "#FFD700"
                            : "currentColor"
                        }
                        fill={
                          savedListingsIds.has(listing.id) ? "#FFD700" : "none"
                        }
                      />
                    </Button>
                  ) : undefined
                }
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
