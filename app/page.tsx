"use client";

import ListingCard from "@/components/ui/listing-card";
import { getListingById } from "@/lib/queries/listings";
import { SearchOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Col,
  DatePicker,
  Input,
  Modal,
  Row,
  Select,
  Typography,
} from "antd";
import type { Dayjs } from "dayjs";
import { FC, useState } from "react";

const { RangePicker } = DatePicker;
const { Text } = Typography;

const priceOptions = [
  "$0 - $500",
  "$500 - $1000",
  "$1000 - $1500",
  "$1500 - $2000",
  "$2000+",
];

export const SearchBar: FC = () => {
  const [location, setLocation] = useState<string | undefined>();
  const [dates, setDates] = useState<[Dayjs, Dayjs] | null>(null);
  const [rooms, setRooms] = useState<number | undefined>();
  const [price, setPrice] = useState<string | undefined>();

  const locations = ["Midtown", "North Avenue", "Home Park", "West Midtown"];

  const handleSearch = () => {
    console.log({ location, dates, rooms, price });
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

      {/* Price */}
      <Select
        placeholder="Price Max"
        value={price}
        onChange={setPrice}
        style={{ minWidth: 150, borderRadius: 999 }}
      >
        {priceOptions.map((price) => (
          <Select.Option key={price} value={price}>
            {price}
          </Select.Option>
        ))}
      </Select>

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
    <div style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      {/* Search bar */}
      <Row justify="center" style={{ padding: "32px" }}>
        <Col>
          <SearchBar />
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

      {/* Modal */}
      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width="90%"
        style={{ top: "5%", padding: 0 }}
        styles={{
          body: { padding: 0, overflow: "hidden" },
        }}
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
            {/* {selectedListing?.images?.map((img, idx) => (
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
            ))} */}
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
            {/* Title and Price */}
            <div>
              <h1 style={{ margin: 0, fontSize: "28px" }}>
                {selectedListing?.title}
              </h1>
              <Text strong style={{ fontSize: 20, color: "#222" }}>
                {selectedListing?.price.toString()}
              </Text>
            </div>
            {/* Rooms and Property Info */}
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
                <strong>Rooms:</strong>{" "}
                {selectedListing?.num_rooms_available.toString()} /{" "}
                {selectedListing?.total_rooms.toString()}
              </Text>
              <Text>
                <strong>Property Type:</strong> {selectedListing?.property_type}
              </Text>
              <Text>
                <strong>Square Footage:</strong> {selectedListing?.sqft} sqft
              </Text>
            </div>
            {/* Location */}
            <div style={{ borderBottom: "1px solid #eee", paddingBottom: 16 }}>
              <Text>
                <strong>Location:</strong> {selectedListing?.location}
              </Text>
            </div>
            {/* Utilities */}
            <div style={{ borderBottom: "1px solid #eee", paddingBottom: 16 }}>
              <Text>
                <strong>Utilities Included:</strong>{" "}
                {selectedListing?.utilities_included ? "Yes" : "No"}
              </Text>
            </div>
            {/* Description */}
            <div>
              <Text strong>Description:</Text>
              <p style={{ marginTop: 8, lineHeight: 1.6 }}>
                {selectedListing?.description}
              </p>
            </div>
            {/* Contact Button */} {/* link to messaging page */}
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
