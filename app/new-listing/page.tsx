"use client";

import { useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Typography,
  Upload,
  message,
  Space,
  Card,
  DatePicker,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { createListing } from "@/lib/queries/listings";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { useUser } from "@stackframe/stack";
import { useQuery } from "@tanstack/react-query";
import { getUserByAuthId } from "@/lib/queries/users";

const { TextArea } = Input;
const { Title, Text } = Typography;

const propertyTypes = ["APARTMENT", "HOUSE"] as const;
const locations = [
  "Midtown",
  "WestMidtown",
  "HomePark",
  "NorthAvenue",
] as const;

interface NewListingFormValues {
  title: string;
  description: string;
  address: string;
  startDate: dayjs.Dayjs;
  endDate: dayjs.Dayjs;
  numRoomsAvailable: number;
  numRoommates: number;
  totalRooms: number;
  price: number;
  sqft: number;
  propertyType: (typeof propertyTypes)[number];
  location: (typeof locations)[number];
  distanceInMiles?: number;
}

export default function NewListingPage() {
  const [form] = Form.useForm<NewListingFormValues>();
  const router = useRouter();
  const [utilitiesIncluded, setUtilitiesIncluded] = useState(true);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const user = useUser();

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

  const createListingMutation = useMutation({
    mutationFn: async (values: NewListingFormValues) => {
      if (!dbUser) {
        message.error("User not found. Please sign in again.");
        setLoading(false);
        return;
      }

      setLoading(true);

      const response = await createListing({
        distanceInMiles: values.distanceInMiles ? values.distanceInMiles : 0,
        address: values.address,
        description: values.description,
        startDate: dayjs(values.startDate).toDate(),
        endDate: dayjs(values.endDate).toDate(),
        numRoomsAvailable: values.numRoomsAvailable,
        numberRoommates: values.numRoommates,
        totalRooms: values.totalRooms,
        title: values.title,
        price: Number(values.price),
        utilitiesIncluded,
        sqft: Number(values.sqft),
        propertyType: values.propertyType,
        location: values.location,
        imageUrls,
        listerId: Number(dbUser.id),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      setLoading(false);

      if (response.isError) {
        console.error("Error creating listing response:", response.message);
      }

      return response;
    },
    onSuccess: () => {
      console.log("Listing created successfully");
      router.push("/profile/my_listings");
    },
    onError: () => {
      setLoading(false);
      console.error("Error creating listing");
    },
  });

  const handleSubmit = (values: NewListingFormValues) => {
    createListingMutation.mutate(values);
  };

  return (
    <div
      style={{
        padding: 32,
        display: "flex",
        justifyContent: "center",
        minHeight: "90vh",
      }}
    >
      <Card
        style={{
          width: "80%",
          maxWidth: 1000,
          borderRadius: 24,
          padding: 32,
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          background: "#fff",
        }}
      >
        <Title level={2} style={{ textAlign: "center", marginBottom: 32 }}>
          Create New Listing
        </Title>

        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
          <Form.Item label="Title" name="title" rules={[{ required: true }]}>
            <Input placeholder="Cozy dorm near campus" size="large" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true }]}
          >
            <TextArea
              placeholder="Describe your property"
              rows={4}
              size="large"
            />
          </Form.Item>

          {/* Image Upload */}
          <Form.Item label="Images">
            <Upload
              listType="picture-card"
              multiple
              maxCount={10}
              beforeUpload={() => false}
              onChange={(info) => {
                setImageUrls(
                  info.fileList.map((f) => f.originFileObj?.name || "")
                );
              }}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
            <Text type="secondary" style={{ fontSize: 12 }}>
              JPG, PNG, or GIF. Max 2MB per image.
            </Text>
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true }]}
          >
            <Input placeholder="123 Main St, Atlanta, GA" size="large" />
          </Form.Item>

          <Form.Item
            label="Price ($/month)"
            name="price"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} size="large" />
          </Form.Item>

          <Form.Item
            label="Square Footage"
            name="sqft"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} size="large" />
          </Form.Item>

          <Form.Item
            label="Number of Rooms Available"
            name="numRoomsAvailable"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} size="large" />
          </Form.Item>

          <Form.Item
            label="Number of Roommates per Room"
            name="numRoommates"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} size="large" />
          </Form.Item>

          <Form.Item
            label="Total Rooms"
            name="totalRooms"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} size="large" />
          </Form.Item>

          <Form.Item
            label="Property Type"
            name="propertyType"
            rules={[{ required: true }]}
          >
            <Select
              options={propertyTypes.map((type) => ({
                label: type,
                value: type,
              }))}
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Location"
            name="location"
            rules={[{ required: true }]}
          >
            <Select
              options={locations.map((loc) => ({ label: loc, value: loc }))}
              size="large"
            />
          </Form.Item>

          <Form.Item label="Distance in Miles" name="distanceInMiles">
            <InputNumber min={0} style={{ width: "100%" }} size="large" />
          </Form.Item>

          <Form.Item
            label="Start Date"
            name="startDate"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} size="large" />
          </Form.Item>

          <Form.Item
            label="End Date"
            name="endDate"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} size="large" />
          </Form.Item>

          {/* Utilities Toggle */}
          <Form.Item label="Utilities Included">
            <Space>
              <Button
                type={utilitiesIncluded ? "primary" : "default"}
                onClick={() => setUtilitiesIncluded(true)}
              >
                Yes
              </Button>
              <Button
                type={!utilitiesIncluded ? "primary" : "default"}
                onClick={() => setUtilitiesIncluded(false)}
              >
                No
              </Button>
            </Space>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              style={{ width: "100%" }}
            >
              Create Listing
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
