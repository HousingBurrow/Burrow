import React, { FC, ReactNode, useState } from "react";
import { Button, Card, Typography } from "antd";
import Image from "next/image";
import { startCase } from "lodash";
import { LuBookmark } from "react-icons/lu";

const { Text, Title } = Typography;
export interface ListingCardProps {
  listing: {
    title: string;
    imageUrl: string;
    location: string;
    price: number;
  };
  onCardClick: () => void;
  hoverButton?: ReactNode;
}

const ListingCard: FC<ListingCardProps> = ({
  listing,
  onCardClick,
  hoverButton,
}) => {
  const { title: title, imageUrl, location, price } = listing;

  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      hoverable
      style={{
        borderRadius: "8px",
      }}
      onClick={onCardClick}
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
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Image
            alt={title}
            src={imageUrl}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={85}
          />
          {hoverButton && (
            <div
              style={{
                top: "8px",
                right: "8px",
                display: "flex",
                position: "absolute",
                alignItems: "center",
                justifyContent: "center",
                opacity: isHovered ? 1 : 0,
                transition: "opacity 0.2s ease",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {hoverButton}
            </div>
          )}
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
