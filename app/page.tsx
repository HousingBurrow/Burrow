"use client";

import ListingCard from "@/components/home/listing-card";
import ListingModal from "@/components/home/listing-modal";
import { SearchBar, searchFormSchema } from "@/components/home/search-bar";
import { getAllListings } from "@/lib/queries/listings";
import { AppListing } from "@/lib/schemas";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Col, Divider, Row } from "antd";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import z from "zod";

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<AppListing | null>(
    null
  );

  const [filterState, setFilterState] = useState<
    z.infer<typeof searchFormSchema> | undefined
  >();

  useEffect(() => console.log(filterState), [filterState])

  // Transform SearchBar format to getAllListings format
  const transformFilters = (searchData: z.infer<typeof searchFormSchema> | undefined) => {
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
    isFetching,
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

  const showModal = (listing: AppListing) => {
    setSelectedListing(listing);
    setIsModalOpen(true);
  };

  const handleOk = () => setIsModalOpen(false);
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
        <Row gutter={[16, 16]} style={{ padding: "32px", width: "100%" }}>
          {listings?.pages
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
                  onClick={() => showModal(listing)}
                />
              </Col>
            ))}
        </Row>
      </InfiniteScroll>

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
