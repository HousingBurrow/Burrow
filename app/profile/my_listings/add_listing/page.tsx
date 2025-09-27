'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Form,
  Input,
  InputNumber,
  Select,
  Radio,
  Upload,
  Button,
  Typography,
  Space,
  DatePicker,
  message,
  Row,
  Col,
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import dayjs, { Dayjs } from 'dayjs'

type ListingForm = {
  title: string
  address: string
  description?: string
  propertyType: 'apartment' | 'house'
  location: string
  price: number
  totalRooms: number
  roommates: number
  utilitiesIncluded: boolean
  sqft?: number
  images?: any[]
  startDate?: Dayjs
  endDate?: Dayjs
}

const PROPERTY_TYPES = [
  { label: 'Apartment', value: 'apartment' },
  { label: 'House', value: 'house' },
]

const LOCATIONS = [
  { label: 'Midtown', value: 'Midtown' },
  { label: 'West Midtown', value: 'West Midtown' },
  { label: 'Home Park', value: 'Home Park' },
  { label: 'North Avenue', value: 'North Avenue' },
]

export default function AddListingPage() {
  const [form] = Form.useForm<ListingForm>()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function onFinish(values: ListingForm) {
    try {
      setLoading(true)
      const payload = {
        ...values,
        startDate: values.startDate?.toISOString(),
        endDate: values.endDate?.toISOString(),
      }
      // TODO: replace with real API call
      await new Promise((r) => setTimeout(r, 700))
      message.success('Listing created')
      router.push('/profile/my_listings')
    } catch (e: any) {
      message.error(e.message || 'Failed to create listing')
    } finally {
      setLoading(false)
    }
  }

  const normFile = (e: any) => (Array.isArray(e) ? e : e?.fileList)

  return (
    <div style={{ width: '100%' }}>
      <Typography.Title level={3} style={{ marginTop: 0 }}>
        Add New Listing
      </Typography.Title>

      <Form<ListingForm>
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          propertyType: 'apartment',
          price: 500,
          totalRooms: 1,
          roommates: 0,
          utilitiesIncluded: false,
        }}
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: 'Please enter a title' }]}
        >
          <Input placeholder="e.g., Cozy Apartment in Midtown" />
        </Form.Item>

        <Form.Item
          name="address"
          label="Address"
          rules={[{ required: true, message: 'Please enter the address' }]}
        >
          <Input placeholder="Street, City, State ZIP" />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <Input.TextArea rows={4} placeholder="Describe the property, rules, amenities…" />
        </Form.Item>

        {/* Two columns: Property type / Location */}
        <Row gutter={[16, 0]}>
          <Col xs={24} md={12}>
            <Form.Item name="propertyType" label="Property type" rules={[{ required: true }]}>
              <Select options={PROPERTY_TYPES} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="location" label="Location" rules={[{ required: true }]}>
              <Select options={LOCATIONS} showSearch style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        {/* Two columns: Price / Sqft */}
        <Row gutter={[16, 0]}>
          <Col xs={24} md={12}>
            <Form.Item name="price" label="Price (per month)" rules={[{ required: true }]}>
              <InputNumber min={0} prefix="$" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="sqft" label="Sqft">
              <InputNumber min={0} style={{ width: '100%' }} placeholder="e.g., 900" />
            </Form.Item>
          </Col>
        </Row>

        {/* Two columns: Total rooms / Roommates */}
        <Row gutter={[16, 0]}>
          <Col xs={24} md={12}>
            <Form.Item name="totalRooms" label="Total rooms" rules={[{ required: true }]}>
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="roommates" label="Number of roommates" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="utilitiesIncluded" label="Utilities included" rules={[{ required: true }]}>
          <Radio.Group>
            <Radio value={true}>Yes</Radio>
            <Radio value={false}>No</Radio>
          </Radio.Group>
        </Form.Item>

        {/* Two columns: Start / End Date */}
        <Row gutter={[16, 0]}>
          <Col xs={24} md={12}>
            <Form.Item name="startDate" label="Start date">
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="endDate"
              label="End date"
              dependencies={['startDate']}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value: Dayjs | undefined) {
                    const start = getFieldValue('startDate') as Dayjs | undefined
                    if (!value || !start || value.isSame(start) || value.isAfter(start)) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error('End date must be same or after start'))
                  },
                }),
              ]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="images"
          label="Images"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          extra="You can upload multiple images. They won't be uploaded yet."
        >
          <Upload listType="picture-card" multiple beforeUpload={() => false}>
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>
        </Form.Item>

        <Space>
          <Button onClick={() => router.back()}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Create listing
          </Button>
        </Space>
      </Form>
    </div>
  )
}