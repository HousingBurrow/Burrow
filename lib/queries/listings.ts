"use server";

import { Listing, Prisma, PropertyType, Location } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { AppListing } from "../schemas";
import { ActionResult } from "../utils/action-result";


type CreateListingsProps = Omit<AppListing, "id">;
type UpdateListingProps = Partial<AppListing>;

export async function updateListing({
  id,
  distanceInMiles,
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
  sqft,
  propertyType,
  location,
  imageUrls,
  listerId,
  createdAt,
  updatedAt,
}: UpdateListingProps): ActionResult<Listing> {
  try {
    const listing = await prisma.listing.update({
      where: { id },
      data: {
        distance_in_miles: distanceInMiles,
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
        sqft: sqft,
        property_type: propertyType,
        location: location,
        imageUrls,
        lister_id: listerId,
        created_at: createdAt,
        updated_at: updatedAt,
      },
    });
    return { isError: false, data: listing };
  } catch (e: unknown) {
    console.error("Error updating listing");
    const message = e instanceof Error ? e.message : "Error updating listing";
    return { isError: true, message };
  }
}

export async function createListing({
  distanceInMiles,
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
  sqft,
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
        distance_in_miles: distanceInMiles,
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
        sqft: sqft,
        property_type: propertyType,
        location: location,
        imageUrls,
        lister_id: listerId,
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

export async function getListingById(id: number): ActionResult<AppListing> {
  try {
    const rawListing = await prisma.listing.findUniqueOrThrow({
      where: { id },
    });

    // decimal doesn't work so convert decimal to string
    const listing = {
      id: rawListing.id,
      title: rawListing.title,
      address: rawListing.address,
      description: rawListing.description,
      propertyType: rawListing.property_type,
      location: rawListing.location,
      distanceInMiles: Number(rawListing.distance_in_miles),
      price: Number(rawListing.price),
      numRoomsAvailable: rawListing.num_rooms_available,
      totalRooms: rawListing.total_rooms,
      numberRoommates: rawListing.number_roommates,
      utilitiesIncluded: rawListing.utilities_included,
      sqft: rawListing.sqft,
      imageUrls: rawListing.imageUrls,
      startDate: rawListing.start_date,
      endDate: rawListing.end_date,
      createdAt: rawListing.created_at,
      updatedAt: rawListing.updated_at,
      listerId: rawListing.lister_id,
    } as AppListing;

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

interface GetListingsProps {
  encodedCursor?: string;
  limit?: number;
  filters?: {
    minPrice?: number;
    maxPrice?: number;
    propertyType?: PropertyType;
    location?: Location;
  };
}

interface PaginatedListingsResult {
  totalCount: number;
  thisPageCount: number;
  nextCursor: string | null;
  data: Listing[];
}

interface CursorData {
  date: string;
  id: number;
}

function encodeCursor(cursor: CursorData): string {
  return Buffer.from(JSON.stringify(cursor)).toString('base64');
}

function decodeCursor(encodedCursor: string): CursorData {
  return JSON.parse(Buffer.from(encodedCursor, 'base64').toString());
}

export async function getAllListings({ 
  encodedCursor, 
  limit = 10, 
  filters 
}: GetListingsProps = {}): ActionResult<PaginatedListingsResult> {
  try {
    const cursor = encodedCursor ? decodeCursor(encodedCursor) : null;
    
    const whereClause: Prisma.ListingWhereInput = {};

    // Handle price filters
    if (filters?.minPrice || filters?.maxPrice) {
      whereClause.price = {};
      if (filters.minPrice) whereClause.price.gte = filters.minPrice;
      if (filters.maxPrice) whereClause.price.lte = filters.maxPrice;
    }

    // Handle other filters
    if (filters?.propertyType) {
      whereClause.property_type = filters.propertyType;
    }

    if (filters?.location) {
      whereClause.location = filters.location;
    }


    // Handle cursor for pagination
    if (cursor) {
      whereClause.OR = [
        {
          created_at: { lt: new Date(cursor.date) },
        },
        {
          created_at: new Date(cursor.date),
          id: { lt: cursor.id },
        },
      ];
    }

    const listingsCount = prisma.listing.count({
      where: whereClause,
    });

    const listingPage = prisma.listing.findMany({
      take: limit,
      where: whereClause,
      orderBy: [{ created_at: 'desc' }, { id: 'desc' }],
      include: {
        apartmentDetails: true,
        houseDetails: true,
        lister: true
      }
    });

    const [totalCount, data] = await Promise.all([listingsCount, listingPage]);
    
    const thisPageCount = data.length;
    const lastItem = data[thisPageCount - 1];
    let nextCursor = null;
    const hasMore = thisPageCount === limit && totalCount > thisPageCount;
    
    if (lastItem && hasMore) {
      nextCursor = encodeCursor({
        date: lastItem.created_at.toISOString(),
        id: lastItem.id,
      });
    }

    return {
      isError: false,
      data: {
        totalCount,
        thisPageCount,
        nextCursor,
        data,
      },
    };
  } catch (e) {
    console.error(e);
    return { isError: true, message: (e as Error).message };
  }
}