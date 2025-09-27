import { AppListing } from "@/lib/schemas";
import { Button, Modal, Typography, Badge } from "antd";
import { CalendarOutlined, EnvironmentOutlined, HomeOutlined, DollarOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useState } from "react";

const { Text } = Typography;

interface ListingModalProps {
  isOpen: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  selectedListing: AppListing;
}

// Image Gallery Component
const ImageGallery = ({ imageUrls, title }: { imageUrls: string[]; title: string }) => {
  return (
    <div
      style={{
        width: "50%",
        height: "100%",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        padding: "16px",
        backgroundColor: "#fafafa",
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

// Individual Image Card Component
const ImageCard = ({ src, alt, priority = false }: { src: string; alt: string; priority?: boolean }) => {
  return (
    <div
      style={{
        position: "relative",
        borderRadius: "6px",
        overflow: "hidden",
        minHeight: "400px",
        border: "1px solid #e5e5e5",
      }}
    >
      <Image
        src={src}
        alt={alt}
        width={1600}
        height={1067}
        sizes="(max-width: 768px) 100vw, 60vw"
        quality={75}
        style={{
          width: "100%",
          height: "auto",
          minHeight: "400px",
          objectFit: "cover",
        }}
        priority={priority}
      />
    </div>
  );
};

// Header Section Component
const ListingHeader = ({ title, price }: { title: string; price: number }) => {
  return (
    <div style={{ marginBottom: "24px", paddingBottom: "16px", borderBottom: "1px solid #e5e5e5" }}>
      <h1 style={{ 
        margin: 0, 
        fontSize: "24px", 
        fontWeight: "600",
        color: "#1a1a1a",
        lineHeight: "1.3"
      }}>
        {title}
      </h1>
      <div style={{ 
        display: "flex", 
        alignItems: "baseline", 
        gap: "4px",
        marginTop: "8px"
      }}>
        <Text style={{ 
          fontSize: "20px", 
          color: "#1a1a1a",
          fontWeight: "500"
        }}>
          ${price.toLocaleString()}
        </Text>
        <Text style={{ color: "#666", fontSize: "14px" }}>/month</Text>
      </div>
    </div>
  );
};

// Availability Section Component
const AvailabilitySection = ({ startDate, endDate }: { startDate?: Date; endDate?: Date }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  };

  return (
    <div style={{ 
      backgroundColor: "#fff",
      padding: "16px",
      border: "1px solid #e5e5e5",
      borderRadius: "6px",
      marginBottom: "16px"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
        <CalendarOutlined style={{ color: "#666", fontSize: "14px" }} />
        <Text style={{ fontSize: "14px", color: "#1a1a1a", fontWeight: "500" }}>
          Availability
        </Text>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <div style={{ fontSize: "13px", color: "#666" }}>
          <strong>From:</strong> {startDate ? formatDate(startDate) : "Not specified"}
        </div>
        <div style={{ fontSize: "13px", color: "#666" }}>
          <strong>Until:</strong> {endDate ? formatDate(endDate) : "Not specified"}
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
  location 
}: { 
  numRoomsAvailable: number;
  totalRooms: number;
  propertyType: string;
  sqft: number;
  utilitiesIncluded: boolean;
  location: string;
}) => {
  return (
    <div style={{ 
      backgroundColor: "#fff",
      padding: "16px",
      border: "1px solid #e5e5e5",
      borderRadius: "6px",
      marginBottom: "16px"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
        <HomeOutlined style={{ color: "#666", fontSize: "14px" }} />
        <Text style={{ fontSize: "14px", color: "#1a1a1a", fontWeight: "500" }}>
          Details
        </Text>
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "12px",
        fontSize: "13px"
      }}>
        <div>
          <div style={{ color: "#666", marginBottom: "2px" }}>Rooms</div>
          <div style={{ color: "#1a1a1a" }}>{numRoomsAvailable} / {totalRooms}</div>
        </div>
        <div>
          <div style={{ color: "#666", marginBottom: "2px" }}>Type</div>
          <div style={{ color: "#1a1a1a" }}>{propertyType}</div>
        </div>
        <div>
          <div style={{ color: "#666", marginBottom: "2px" }}>Area</div>
          <div style={{ color: "#1a1a1a" }}>{sqft} sqft</div>
        </div>
        <div>
          <div style={{ color: "#666", marginBottom: "2px" }}>Utilities</div>
          <div style={{ color: utilitiesIncluded ? "#10b981" : "#ef4444", fontWeight: "500" }}>
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
        backgroundColor: "#1a1a1a",
        borderColor: "#1a1a1a",
        borderRadius: "6px",
        fontSize: "14px",
        fontWeight: "500"
      }}
      onClick={onClick}
    >
      Contact Leaser
    </Button>
  );
};

// Main Modal Component
export default function ListingModal({
  isOpen,
  handleOk,
  handleCancel,
  selectedListing,
}: ListingModalProps) {
  return (
    <Modal
      open={isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      width="85%"
      style={{ top: "2.5%" }}
      styles={{
        body: { 
          padding: 0, 
          overflow: "hidden"
        },
      }}
      footer={null}
    >
      <div style={{ display: "flex", height: "85vh", overflow: "hidden" }}>
        <ImageGallery 
          imageUrls={selectedListing?.imageUrls || []}
          title={selectedListing?.title || ""}
        />
        
        {/* Details Panel */}
        <div
          style={{
            width: "50%",
            padding: "24px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#fff",
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          }}
        >
          <ListingHeader 
            title={selectedListing?.title || ""}
            price={selectedListing?.price || 0}
          />
          
          <AvailabilitySection 
            startDate={selectedListing?.startDate}
            endDate={selectedListing?.endDate}
          />

          <PropertyDetails 
            numRoomsAvailable={selectedListing?.numRoomsAvailable || 0}
            totalRooms={selectedListing?.totalRooms || 0}
            propertyType={selectedListing?.propertyType || ""}
            sqft={selectedListing?.sqft || 0}
            utilitiesIncluded={selectedListing?.utilitiesIncluded || false}
            location={selectedListing?.location || ""}
          />

          {/* Description */}
          <div style={{ 
            backgroundColor: "#fff",
            padding: "16px",
            border: "1px solid #e5e5e5",
            borderRadius: "6px",
            marginBottom: "24px"
          }}>
            <Text style={{ fontSize: "14px", color: "#1a1a1a", fontWeight: "500", display: "block", marginBottom: "8px" }}>
              Description
            </Text>
            <p style={{ 
              margin: 0, 
              lineHeight: 1.5,
              color: "#666",
              fontSize: "13px"
            }}>
              {selectedListing?.description}
            </p>
          </div>

          <ContactButton onClick={() => alert("Contact Leaser!")} />
        </div>
      </div>
    </Modal>
  );
}