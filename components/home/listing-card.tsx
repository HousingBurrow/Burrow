import React, { FC } from "react";
import { Card, Typography, Button } from "antd";
import Image from "next/image";
import { startCase } from "lodash";

const { Text, Title } = Typography;

export interface ListingCardProps {
  listing: {
    title: string;
    imageUrl: string;
    location: string;
    price: number;
  };
  onViewDetails?: () => void;
}

const ListingCard: FC<ListingCardProps> = ({ listing, onViewDetails }) => {
  const { title: title, imageUrl, location, price } = listing;
  return (
    <Card
      hoverable
      cover={
        <div style={{ position: 'relative', width: '100%', height: 200 }}>
          <Image 
            alt={title} 
            src={imageUrl} 
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={85}
          />
        </div>
      }
    >
      <Title level={5}>{title}</Title>
      <Text type="secondary">{startCase(location)}</Text>
      <br />
      <Text strong>{`$${price.toString()}`}</Text>
      {onViewDetails && (
        <>
          <br />
          <Button
            type="primary"
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
