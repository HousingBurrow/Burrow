"use client";

import { Row, Space, Button } from "antd";
import Title from "antd/es/typography/Title";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { AddListingModal } from "@/components/home/add-listing-modal"; // ⬅️ create this file

export function Header() {
  const pathname = usePathname();
  const isProfilePage = pathname.startsWith("/profile");
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <Row
        style={{
          background: "#fff",
          height: 64,
          padding: "0 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            height: 40,
          }}
        >
          <Image
            src="/logo.png"
            alt="Burrow Logo"
            width={200}
            height={200}
            style={{ objectFit: "contain", display: "block" }}
          />
        </Link>

        <Space>
          {isProfilePage ? (
            <Link href="/"><Button type="text">Home</Button></Link>
          ) : (
            <Link href="/profile/about_me"><Button type="text">Profile</Button></Link>
          )}

          {/* ✅ Add Listing button */}
          <Button type="text" onClick={() => setOpen(true)}>Add Listing</Button>

          <Link href="/settings"><Button type="text">Settings</Button></Link>
          <Button type="text">Logout</Button>
        </Space>
      </Row>

      {/* Modal */}
      <AddListingModal
        open={open}
        onClose={() => setOpen(false)}
        onCreated={() => {
          setOpen(false);
          router.push("/profile/my_listings"); // redirect after create
        }}
      />
    </>
  );
}
