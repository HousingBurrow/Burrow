import { AppListing } from "@/lib/schemas";
import { Button, Modal, Typography } from "antd";
import Image from "next/image";
const { Text } = Typography;

interface ListingModalProps {
  isOpen: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  selectedListing: AppListing;
}

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
      width="90%"
      style={{ top: "5%", padding: 0 }}
      styles={{
        body: { padding: 0, overflow: "hidden" },
      }}
      footer={null}
    >
      <div style={{ display: "flex", height: "80vh" }}>
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
          {selectedListing?.imageUrls?.map((img, idx) => (
            <Image
              key={idx}
              src={img}
              alt={`${selectedListing.title} - ${idx + 1}`}
              width={1600}           // intrinsic dimensions (any consistent ratio works)
              height={1067}
              sizes="(max-width: 768px) 100vw, 60vw"
              quality={40}
              style={{
                width: "100%",       // responsive
                height: "auto",      // keep aspect ratio
                borderRadius: 8,
                objectFit: "cover",
              }}
              priority={idx === 0}
            />
          ))}
        </div>

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
              {selectedListing?.price.toString()}
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
              <strong>Rooms:</strong>{" "}
              {selectedListing?.numRoomsAvailable.toString()} /{" "}
              {selectedListing?.totalRooms.toString()}
            </Text>
            <Text>
              <strong>Property Type:</strong> {selectedListing?.propertyType}
            </Text>
            <Text>
              <strong>Square Footage:</strong> {selectedListing?.sqft} sqft
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
  );
}
