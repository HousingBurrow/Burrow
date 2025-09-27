"use client";

import React, { FC } from "react";
import { Card, Typography, Button } from "antd";

const { Text, Title } = Typography;

export interface ListingCardProps {
  id: number;
  title: string;
  location: string;
  price: string;
  image: string;
  onViewDetails?: () => void;
}

const ListingCard: FC<ListingCardProps> = ({ title, location, price, image, onViewDetails }) => {
  return (
    <Card hoverable cover={<img alt={title} src={image} />}>
      <Title level={5}>{title}</Title>
      <Text type="secondary">{location}</Text>
      <br />
      <Text strong>{price}</Text>
      {onViewDetails && (
        <>
          <br />
          <Button type="primary" style={{ marginTop: 8 }} onClick={onViewDetails}>
            View Details
          </Button>
        </>
      )}
    </Card>
  );
};

export default ListingCard;