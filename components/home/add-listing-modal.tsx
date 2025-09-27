'use client'

import React, { useMemo } from 'react'
import {
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  DatePicker,
  Radio,
  Upload,
  Button,
  Row,
  Col,
  Divider,
  Typography,
  Space,
} from 'antd'
import { PlusOutlined, InboxOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

type AddListingModalProps = {
  open: boolean
  onClose: () => void
  onCreated?: (listing: any) => void
}

const { Title, Text } = Typography
const { Dragger } = Upload

const LOCATIONS = [
  { label: 'Midtown', value: 'Midtown' },
  { label: 'West Midtown', value: 'WestMidtown' },
  { label: 'Home Park', value: 'HomePark' },
  { label: 'North Avenue', value: 'NorthAvenue' },
]

const PROPERTY_TYPES = [
  { label: 'Apartment', value: 'APARTMENT' },
  { label: 'House', value: 'HOUSE' },
]

const ROOM_TYPE_OPTIONS = [
  { label: 'Single', value: 'SINGLE' },
  { label: 'Double', value: 'DOUBLE' },
]

const APARTMENT_TYPE_OPTIONS = [
  { label: '6×6', value: 'SixBySix' },
  { label: '5×5', value: 'FiveByFive' },
  { label: '4×4', value: 'FourByFour' },
  { label: '3×3', value: 'ThreeByThree' },
  { label: '2×2', value: 'TwoByTwo' },
  { label: 'Studio', value: 'Studio' },
  { label: '5×3', value: 'FiveByThree' },
  { label: '5×4', value: 'FiveByFour' },
]

export function AddListingModal({ open, onClose, onCreated }: AddListingModalProps) {
  const [form] = Form.useForm()

  const startDate = Form.useWatch('startDate', form)
  const propertyType = Form.useWatch('propertyType', form) ?? 'APARTMENT'

  const disabledEnd = (d: dayjs.Dayjs) =>
    startDate ? d.isBefore(dayjs(startDate), 'day') : false

  const priceFormatter = (v?: number | string) =>
    typeof v === 'number' || (typeof v === 'string' && v !== '')
      ? `$ ${String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
      : ''

  const priceParser = (v?: string) => (v ? Number(v.replace(/[^\d.-]/g, '')) : 0)

  const onFinish = async (values: any) => {
    // TODO: Replace with your real API
    // await fetch('/api/listings', { method: 'POST', body: JSON.stringify(values) })
    onCreated?.(values)
    form.resetFields()
    onClose()
  }

  const footer = useMemo(
    () => (
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 12,
          padding: '12px 16px',
          borderTop: '1px solid #f0f0f0',
          background: '#fff',
          position: 'sticky',
          bottom: 0,
        }}
      >
        <Button onClick={() => { form.resetFields(); onClose() }}>Cancel</Button>
        <Button type="primary" onClick={() => form.submit()}>
          Create listing
        </Button>
      </div>
    ),
    [form, onClose]
  )

  return (
    <Modal
      title={null}
      open={open}
      onCancel={() => { form.resetFields(); onClose() }}
      footer={footer}
      width={880}
      destroyOnClose
      styles={{ body: { paddingTop: 0 } }}
    >
      <div style={{ padding: 16 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <Title level={4} style={{ margin: 0 }}>Add New Listing</Title>
          <Text type="secondary">Fields marked with * are required</Text>
        </div>

        <Divider style={{ margin: '12px 0 16px' }} />

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          {/* BASICS */}
          <Title level={5} style={{ marginTop: 0 }}>Basics</Title>
          <Row gutter={12}>
            <Col xs={24} md={16}>
              <Form.Item
                name="title"
                label="Title*"
                rules={[{ required: true, message: 'Please enter a title' }]}
              >
                <Input placeholder="Cozy Apartment in Midtown" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="propertyType"
                label="Property type*"
                rules={[{ required: true }]}
              >
                <Select options={PROPERTY_TYPES} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col xs={24} md={12}>
              <Form.Item
                name="location"
                label="Location*"
                rules={[{ required: true }]}
              >
                <Select options={LOCATIONS} style={{ width: '100%' }} showSearch />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="address"
                label="Address*"
                rules={[{ required: true, message: 'Please enter the address' }]}
              >
                <Input placeholder="Street, City, State ZIP" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} placeholder="Describe the property, amenities, rules…" />
          </Form.Item>

          <Divider style={{ margin: '8px 0 16px' }} />

          {/* DETAILS */}
          <Title level={5} style={{ marginTop: 0 }}>Details</Title>
          <Row gutter={12}>
            <Col xs={24} md={8}>
              <Form.Item
                name="price"
                label="Price (per month)*"
                rules={[{ required: true }]}
                tooltip="Enter the monthly rent"
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  formatter={priceFormatter}
                  parser={priceParser}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="totalRooms"
                label="Total rooms*"
                rules={[{ required: true }]}
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="numberRoommates"
                label="Roommates"
                tooltip="People already living there"
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col xs={24} md={8}>
              <Form.Item name="sqft" label="Sqft">
                <InputNumber min={0} style={{ width: '100%' }} placeholder="e.g., 900" />
              </Form.Item>
            </Col>
            <Col xs={24} md={16}>
              <Form.Item name="utilitiesIncluded" label="Utilities included">
                <Radio.Group
                  optionType="button"
                  buttonStyle="solid"
                  options={[
                    { label: 'Yes', value: true },
                    { label: 'No', value: false },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Conditional specifics */}
          {propertyType === 'APARTMENT' ? (
            <Row gutter={12}>
              <Col xs={24} md={12}>
                <Form.Item name="roomType" label="Room type">
                  <Select options={ROOM_TYPE_OPTIONS} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="apartmentType" label="Apartment type">
                  <Select options={APARTMENT_TYPE_OPTIONS} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
          ) : (
            <Row gutter={12}>
              <Col xs={24} md={12}>
                <Form.Item name="numBathrooms" label="Bathrooms">
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="numRooms" label="Rooms in house">
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
          )}

          <Divider style={{ margin: '8px 0 16px' }} />

          {/* DATES */}
          <Title level={5} style={{ marginTop: 0 }}>Dates</Title>
          <Row gutter={12}>
            <Col xs={24} md={12}>
              <Form.Item name="startDate" label="Start date">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="endDate" label="End date">
                <DatePicker style={{ width: '100%' }} disabledDate={disabledEnd} />
              </Form.Item>
            </Col>
          </Row>

          <Divider style={{ margin: '8px 0 16px' }} />

          {/* MEDIA */}
          <Title level={5} style={{ marginTop: 0 }}>Media</Title>
          <Form.Item
            name="images"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
            extra="Drag images here or click to upload. Files are kept client-side until you implement upload."
          >
            <Dragger multiple beforeUpload={() => false}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag files to this area to upload</p>
              <p className="ant-upload-hint">PNG, JPG up to ~5MB each</p>
            </Dragger>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}
