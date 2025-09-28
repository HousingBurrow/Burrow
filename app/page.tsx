"use client";

import ListingCard from "@/components/home/listing-card";
import ListingModal from "@/components/home/listing-modal";
import { SearchBar, searchFormSchema } from "@/components/home/search-bar";
import { getAllListings } from "@/lib/queries/listings";
import { AppListing } from "@/lib/schemas";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { Button, Col, Divider, Row, Typography } from "antd";
import { useState } from "react";
import { LuBookmark } from "react-icons/lu";
import InfiniteScroll from "react-infinite-scroll-component";
import z from "zod";
import Image from "next/image";
import {
  getSavedListingsForUser,
  getUserByAuthId,
  toggleSaveListing,
} from "@/lib/queries/users";
import { useUser } from "@stackframe/stack";

const { Text } = Typography;

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<AppListing | null>(
    null
  );

  const [filterState, setFilterState] = useState<
    z.infer<typeof searchFormSchema> | undefined
  >();

  const user = useUser();

  // Transform SearchBar format to getAllListings format
  const transformFilters = (
    searchData: z.infer<typeof searchFormSchema> | undefined
  ) => {
    if (!searchData) return undefined;

    return {
      location: searchData.location,
      rooms: searchData.rooms,
      maxPrice: searchData.price?.upper,
      minPrice: searchData.price?.lower,
      startDate: searchData.range?.start,
      endDate: searchData.range?.end,
    };
  };

  const {
    data: listings,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["listings", JSON.stringify(filterState)],
    queryFn: async ({ pageParam }: { pageParam: string | undefined }) => {
      const transformedFilters = transformFilters(filterState);
      const response = await getAllListings({
        encodedCursor: pageParam,
        limit: 12,
        filters: transformedFilters,
      });
      if (response.isError) {
        throw new Error(response.message);
      }
      return response.data;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined,
  });

  const { data: dbUser } = useQuery({
    queryKey: ["signedInUser"],
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
  });

  const { data: savedListingsIds, refetch: refetchSavedListingsIds } = useQuery(
    {
      queryKey: ["savedListings", dbUser],
      queryFn: async () => {
        if (dbUser) {
          const response = await getSavedListingsForUser(dbUser.id);
          if (response.isError) {
            return undefined;
          }

          const listingIds = response.data.map(({ id }) => id);
          const listingIdsSet = new Set(listingIds);

          return listingIdsSet;
        } else {
          return undefined;
        }
      },
    }
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
      refetchSavedListingsIds();
    },
    onError: (error) => {
      console.error("bad stuff happened", error);
    },
  });

  const showModal = (listing: AppListing) => {
    setSelectedListing(listing);
    setIsModalOpen(true);
  };

  const handleCancel = () => setIsModalOpen(false);

  return (
    <div style={{ maxWidth: "100%", overflow: "hidden" }}>
      {/* Search bar */}
      <Row justify="center" style={{ padding: "32px" }}>
        <Col>
          <SearchBar onSearchClicked={setFilterState} />
        </Col>
      </Row>

      <InfiniteScroll
        dataLength={listings?.pages.flatMap((page) => page.data).length ?? 0}
        next={() => {
          if (!isFetchingNextPage) fetchNextPage();
        }}
        hasMore={!!hasNextPage}
        loader={
          <div>
            <Divider>Digging deeper...</Divider>
          </div>
        }
        endMessage={
          <Divider plain>You&apos;ve reached the end of the world</Divider>
        }
        scrollThreshold={0.9} // triggers when 90% of page scrolled
        style={{ width: "100%" }}
      >
        {listings && !isLoading ? (
          <Row gutter={[16, 16]} style={{ padding: "32px", width: "100%" }}>
            {listings.pages
              .flatMap((page) => page.data)
              .map((listing) => (
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
                      dbUser ? (
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
                              savedListingsIds?.has(listing.id)
                                ? "#FFD700"
                                : "currentColor"
                            }
                            fill={
                              savedListingsIds?.has(listing.id)
                                ? "#FFD700"
                                : "none"
                            }
                          />
                        </Button>
                      ) : undefined
                    }
                  />
                </Col>
              ))}
          </Row>
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Image
              src="/standing-prairie-dog.png"
              height={320}
              width={320}
              alt="images"
            />
            <Text strong>Nothing to see here...</Text>
          </div>
        )}
      </InfiniteScroll>

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
