import React, { FC } from "react";
import { Card, Typography } from "antd";
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
  onClick: () => void;
}

const ListingCard: FC<ListingCardProps> = ({ listing, onClick }) => {
  const { title: title, imageUrl, location, price } = listing;
  return (
    <Card
      hoverable
      style={{
        borderRadius: "8px",
      }}
      onClick={onClick}
      cover={
        <div
          style={{
            position: "relative",
            width: "100%",
            height: 200,
            borderRadius: "8px",
            borderBottomRightRadius: "0px",
            borderBottomLeftRadius: "0",
            overflow: "hidden",
          }}
        >
          <Image
            alt={title}
            src={imageUrl}
            fill
            style={{ objectFit: "cover" }}
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
    </Card>
  );
};

export default ListingCard;
