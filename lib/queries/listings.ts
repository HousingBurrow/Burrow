"use server";

import { Listing, Location, PropertyType } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { ActionResult } from "../utils/action-result";

interface CreateListingsProps {
  distance: number;
  address: string;
  description: string;
  startDate: Date;
  endDate: Date;
  numRoomsAvailable: number;
  numberRoommates: number;
  totalRooms: number;
  title: string;
  price: number;
  utilitiesIncluded: boolean;
  sqFt: number;

  propertyType: PropertyType;
  location: Location;
  imageUrls: string[];
  listerId: number;
  createdAt: Date;
  updatedAt: Date;
}

type UpdateListingProps = Partial<CreateListingsProps>;

type ListingUpdateArgs = Parameters<typeof prisma.listing.update>[0];
type ListingUpdateInput = ListingUpdateArgs["data"];

export async function updateListing(
  id: number,
  patch: UpdateListingProps
): Promise<ActionResult<Listing>> {
  try {
    // Build a typed update payload without using `any`
    const data: ListingUpdateInput = {
      ...(patch.distance !== undefined
        ? { distance_in_miles: patch.distance }
        : {}),
      ...(patch.address !== undefined ? { address: patch.address } : {}),
      ...(patch.description !== undefined
        ? { description: patch.description }
        : {}),
      ...(patch.startDate !== undefined ? { start_date: patch.startDate } : {}),
      ...(patch.endDate !== undefined ? { end_date: patch.endDate } : {}),
      ...(patch.numRoomsAvailable !== undefined
        ? { num_rooms_available: patch.numRoomsAvailable }
        : {}),
      ...(patch.numberRoommates !== undefined
        ? { number_roommates: patch.numberRoommates }
        : {}),
      ...(patch.totalRooms !== undefined
        ? { total_rooms: patch.totalRooms }
        : {}),
      ...(patch.title !== undefined ? { Title: patch.title } : {}),
      ...(patch.price !== undefined ? { price: patch.price } : {}),
      ...(patch.utilitiesIncluded !== undefined
        ? { utilities_included: patch.utilitiesIncluded }
        : {}),
      ...(patch.sqFt !== undefined ? { SqFt: patch.sqFt } : {}),
      ...(patch.propertyType !== undefined
        ? { property_type: patch.propertyType }
        : {}),
      ...(patch.location !== undefined ? { Location: patch.location } : {}),
      ...(patch.imageUrls !== undefined ? { imageUrls: patch.imageUrls } : {}),
      ...(patch.listerId !== undefined ? { listerId: patch.listerId } : {}),
      // If your schema does NOT use @updatedAt, set it here:
      ...(patch.updatedAt !== undefined
        ? { updated_at: patch.updatedAt }
        : { updated_at: new Date() }),
    };

    // No-op guard
    if (Object.keys(data).length === 0) {
      return { isError: true, message: "No fields to update" };
    }

    const listing = await prisma.listing.update({ where: { id }, data });
    return { isError: false, data: listing };
  } catch (e: unknown) {
    if (
      typeof e === "object" &&
      e !== null &&
      "code" in e &&
      (e as { code: string }).code === "P2025"
    ) {
      return { isError: true, message: "Listing not found" };
    }
    const message = e instanceof Error ? e.message : "Error updating listing";
    return { isError: true, message };
  }
}

export async function createListing({
  distance,
  address,
  description,
  startDate,
  endDate,
  numRoomsAvailable,
  numberRoommates,
  totalRooms,
  title,
  price,
  utilitiesIncluded,
  sqFt,
  propertyType,
  location,
  imageUrls,
  listerId,
  createdAt,
  updatedAt,
}: CreateListingsProps): ActionResult<Listing> {
  try {
    const listing = await prisma.listing.create({
      data: {
        distance_in_miles: distance,
        address,
        description,
        start_date: startDate,
        end_date: endDate,
        num_rooms_available: numRoomsAvailable,
        number_roommates: numberRoommates,
        total_rooms: totalRooms,
        title: title,
        price,
        utilities_included: utilitiesIncluded,
        sqft: sqFt,
        property_type: propertyType,
        location: location,
        imageUrls,
        listerId,
        created_at: createdAt,
        updated_at: updatedAt,
      },
    });

    return { isError: false, data: listing };
  } catch (e) {
    console.log("Error creating listing", e);
    return { isError: true, message: (e as Error).message };
  }
}

// export async function updateListing()

export async function getListingById(id: number): ActionResult<Listing> {
  try {
    const rawListing = await prisma.listing.findUniqueOrThrow({
      where: { id },
    });
    const listing = JSON.parse(JSON.stringify(rawListing));

    return { isError: false, data: listing };
  } catch (e) {
    console.log("Error getting listing", e);
    return { isError: true, message: (e as Error).message };
  }
}

export async function deleteListing(id: number): ActionResult<Listing> {
  try {
    const listing = await prisma.listing.delete({ where: { id } });
    return { isError: false, data: listing };
  } catch (e) {
    console.log("Error deleting listing", e);
    return { isError: true, message: (e as Error).message };
  }
}
