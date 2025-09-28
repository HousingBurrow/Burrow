import { getUserById } from "@/lib/queries/users";
import { AppListing } from "@/lib/schemas";
import { CalendarOutlined, HomeOutlined } from "@ant-design/icons";
import { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { Button, Modal, Typography } from "antd";
import { startCase } from "lodash";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { toLowerCase } from "zod";

const { Text } = Typography;

// Image Gallery Component - Remove ALL height constraints
const ImageGallery = ({
  imageUrls,
  title,
}: {
  imageUrls: string[];
  title: string;
}) => {
  return (
    <div
      style={{
        width: "50%",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        backgroundColor: "#fafafa",
        maxHeight: "85vh", // Instead of fixed height, use maxHeight to allow natural sizing
      }}
    >
      {imageUrls?.map((img, idx) => (
        <ImageCard
          key={idx}
          src={img}
          alt={`${title} - ${idx + 1}`}
          priority={idx === 0}
        />
      ))}
    </div>
  );
};

// Individual Image Card Component - Let image determine height completely
const ImageCard = ({
  src,
  alt,
  priority = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) => {
  return (
    <div
      style={{
        borderRadius: "6px",
        overflow: "hidden",
        border: "1px solid #931e1eff",
        flexShrink: 0, // Prevent the container from shrinking
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: "100%",
          height: "auto",
          display: "block",
        }}
        loading={priority ? "eager" : "lazy"}
      />
    </div>
  );
};



// Header Section Component
const ListingHeader = ({
  title,
  price,
  lister,
}: {
  title: string;
  price: number;
  lister: User;
}) => {
  return (
    <div
      style={{
        marginBottom: "24px",
        paddingBottom: "16px",
        borderBottom: "1px solid #e5e5e5",
      }}
    >
      <h1
        style={{
          margin: 0,
          fontSize: "24px",
          fontWeight: "600",
          color: "#1a1a1a",
          lineHeight: "1.3",
        }}
      >
        {title}
      </h1>
      <div style={{ display: "flex", gap: "16px", alignItems: "baseline" }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "4px",
            marginTop: "8px",
          }}
        >
          <Text
            style={{
              fontSize: "20px",
              color: "#1a1a1a",
              fontWeight: "500",
            }}
          >
            ${price.toLocaleString()}
          </Text>
          <Text style={{ color: "#666", fontSize: "14px" }}>/month</Text>
        </div>
        <div>
          <Text>
            <span style={{ fontWeight: "700" }}>Posted by:&nbsp;</span>
            {[lister.first_name, lister.last_name].filter(Boolean).join(" ")}
          </Text>
        </div>
      </div>
    </div>
  );
};

// Availability Section Component
const AvailabilitySection = ({
  startDate,
  endDate,
}: {
  startDate?: Date;
  endDate?: Date;
}) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  };

  return (
    <div
      style={{
        backgroundColor: "#fff",
        padding: "16px",
        border: "1px solid #e5e5e5",
        borderRadius: "6px",
        marginBottom: "16px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          marginBottom: "12px",
        }}
      >
        <CalendarOutlined style={{ color: "#666", fontSize: "14px" }} />
        <Text style={{ fontSize: "14px", color: "#1a1a1a", fontWeight: "500" }}>
          Availability
        </Text>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <div style={{ fontSize: "13px", color: "#666" }}>
          <strong>From:</strong>{" "}
          {startDate ? formatDate(startDate) : "Not specified"}
        </div>
        <div style={{ fontSize: "13px", color: "#666" }}>
          <strong>Until:</strong>{" "}
          {endDate ? formatDate(endDate) : "Not specified"}
        </div>
      </div>
    </div>
  );
};

// Property Details Component
const PropertyDetails = ({
  numRoomsAvailable,
  totalRooms,
  propertyType,
  sqft,
  utilitiesIncluded,
  location,
}: {
  numRoomsAvailable: number;
  totalRooms: number;
  propertyType: string;
  sqft: number;
  utilitiesIncluded: boolean;
  location: string;
}) => {
  return (
    <div
      style={{
        backgroundColor: "#fff",
        padding: "16px",
        border: "1px solid #e5e5e5",
        borderRadius: "6px",
        marginBottom: "16px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          marginBottom: "12px",
        }}
      >
        <HomeOutlined style={{ color: "#666", fontSize: "14px" }} />
        <Text style={{ fontSize: "14px", color: "#1a1a1a", fontWeight: "500" }}>
          Details
        </Text>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
          fontSize: "13px",
        }}
      >
        <div>
          <div style={{ color: "#666", marginBottom: "2px" }}>Rooms</div>
          <div style={{ color: "#1a1a1a" }}>
            {numRoomsAvailable} / {totalRooms}
          </div>
        </div>
        <div>
          <div style={{ color: "#666", marginBottom: "2px" }}>Type</div>
          <div style={{ color: "#1a1a1a" }}>{propertyType}</div>
        </div>
        <div>
          <div style={{ color: "#666", marginBottom: "2px" }}>Area</div>
          <div style={{ color: "#1a1a1a" }}>{sqft} sq ft</div>
        </div>
        <div>
          <div style={{ color: "#666", marginBottom: "2px" }}>Utilities</div>
          <div
            style={{
              color: utilitiesIncluded ? "#10b981" : "#ef4444",
              fontWeight: "500",
            }}
          >
            {utilitiesIncluded ? "Included" : "Not Included"}
          </div>
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <div style={{ color: "#666", marginBottom: "2px" }}>Location</div>
          <div style={{ color: "#1a1a1a" }}>{location}</div>
        </div>
      </div>
    </div>
  );
};

// Contact Button Component
const ContactButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button
      type="primary"
      size="large"
      style={{
        marginTop: "auto",
        width: "100%",
        height: "40px",
        borderRadius: "6px",
        fontSize: "14px",
        fontWeight: "500",
        paddingBottom: "1px",
      }}
      onClick={onClick}
    >
      Contact Leaser
    </Button>
  );
};

interface ListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedListing: AppListing;
}

// Main Modal Component
export default function ListingModal({
  isOpen,
  onClose,
  selectedListing,
}: ListingModalProps) {
  const { isLoading, data: user } = useQuery({
    queryKey: ["user", selectedListing.listerId],
    queryFn: async () => {
      const response = await getUserById(selectedListing.listerId);
      if (response.isError) {
        return undefined;
      }

      return response.data;
    },
  });

  return (
    <Modal
      open={isOpen}
      width="85vw"
      centered
      footer={null}
      onCancel={onClose}
      destroyOnHidden
    >
      <div
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        style={{
          display: "flex",
          flexDirection: "row",
          minHeight: "85vh",
          maxHeight: "none", // Remove max height constraint
          gap: "24px",
          overflow: "hidden",
        }}
      >
        <ImageGallery
          imageUrls={selectedListing.imageUrls}
          title={selectedListing.title}
        />

        <div
          style={{
            width: "50%",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#fff",
            paddingTop: "24px",
            fontFamily:
              "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          }}
        >
          {user && (
            <ListingHeader
              title={selectedListing.title}
              price={selectedListing.price}
              lister={user}
            />
          )}
          <AvailabilitySection
            startDate={selectedListing.startDate}
            endDate={selectedListing.endDate}
          />
          <PropertyDetails
            numRoomsAvailable={selectedListing.numRoomsAvailable}
            totalRooms={selectedListing.totalRooms}
            propertyType={startCase(
              selectedListing.propertyType.toString().toLowerCase()
            )}
            sqft={selectedListing.sqft}
            utilitiesIncluded={selectedListing.utilitiesIncluded}
            location={startCase(selectedListing.location)}
          />

          <div
            style={{
              backgroundColor: "#fff",
              padding: "16px",
              border: "1px solid #e5e5e5",
              borderRadius: "6px",
              marginBottom: "24px",
            }}
          >
            <Text
              style={{
                fontSize: "14px",
                color: "#1a1a1a",
                fontWeight: "500",
                display: "block",
                marginBottom: "8px",
              }}
            >
              Description
            </Text>
            <p
              style={{
                margin: 0,
                lineHeight: 1.5,
                color: "#666",
                fontSize: "13px",
              }}
            >
              {selectedListing?.description}
            </p>
          </div>
          {isLoading || !user ? (
            <Button></Button>
          ) : (
            <ContactButton
              onClick={() =>
                (window.location.href = `mailto:${user.email}?subject=${
                  selectedListing.title + " Sublease"
                }&body=${"Hi! I'd like to sublease your place!"}`)
              }
            />
          )}
        </div>
      </div>
    </Modal>
  );
}
