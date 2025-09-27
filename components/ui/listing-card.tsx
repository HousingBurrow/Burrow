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

const ListingCard: FC<ListingCardProps> = ({
  title,
  location,
  price,
  image,
  onViewDetails,
}) => {
  return (
    <Card
      hoverable
      cover={
        <img
          src={image}
          alt={title}
          style={{ height: 180, width: "100%", objectFit: "cover" }}
        />
      }
    >
      <Title level={5} style={{ marginBottom: 4 }}>
        {title}
      </Title>
      <Text type="secondary">{location}</Text>
      <div style={{ marginTop: 8 }}>
        <Text strong>{price}</Text>
      </div>
      {onViewDetails && (
        <>
          <br />
          <Button
            type="primary"
            block
            style={{ marginTop: 8 }}
            onClick={onViewDetails}
          >
            View Details
          </Button>
        </>
      )}
    </Card>
  );
};

export default ListingCard;
