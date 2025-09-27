'use server';

import { PrismaClient, Listing, PropertyType, Location } from '@prisma/client';
import { ActionResult } from '../utils/action-result';
import { prisma } from '../../../lib/prisma';
import { Action } from '@prisma/client/runtime/library';
import { describe } from 'node:test';
import { DataListItemLabelProps, DialogDescription } from '@chakra-ui/react';

interface CreateListingsProp {
  distance: number,
  address: string,
  description: string,
  startDate: Date,
  endDate: Date,
  numRoomsAvailable: number,
  numberRoommates: number,
  totalRooms: number,
  title: string,
  price: number,
  utilitiesIncluded: boolean,
  sqFt: number,


  propertyType: PropertyType,
  location: Location,
  imageUrl: string,
  listerId: number,
  createdAt: Date,
  updatedAt: Date,

}

// keep your existing imports (but remove any unused ones to avoid build errors)

type UpdateListingProps = {
  id: number;
  distance?: number;
  address?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  numRoomsAvailable?: number;
  numberRoommates?: number;
  totalRooms?: number;
  title?: string;
  price?: number;
  utilitiesIncluded?: boolean;
  sqFt?: number;

  propertyType?: PropertyType;
  location?: Location;
  imageUrl?: string;
  listerId?: number;
  updatedAt?: Date;
}

export async function updateListing({ id, distance, address, description, startDate, endDate, numRoomsAvailable, numberRoommates, totalRooms, title, price, utilitiesIncluded, sqFt, propertyType, location, imageUrl, updatedAt}: UpdateListingProps): ActionResult<Listing> {
  try {
    const listing = await prisma.listing.update({ where: { id }, data: {distance_in_miles: distance, address: address, description: description, start_date: startDate, end_date: endDate, num_rooms_available: numRoomsAvailable, number_roommates: numberRoommates, total_rooms: totalRooms, Title: title, price: price, utilities_included: utilitiesIncluded, SqFt: sqFt, property_type: propertyType, Location: location, imageUrl: imageUrl, updated_at: updatedAt }} );
    return { isError: false, data: listing};
  } catch (e) {
    console.log("Error when updating listing", e);
    return { isError: true, message: (e as Error).message};
  }
}



export async function createListing({ distance, address, description, startDate, endDate, numRoomsAvailable, numberRoommates, totalRooms, title, price, utilitiesIncluded, sqFt, propertyType, location, imageUrl, listerId, createdAt, updatedAt }: CreateListingsProp): ActionResult<Listing> {
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
        Title: title,
        price,
        utilities_included: utilitiesIncluded,

        SqFt: sqFt,
        property_type: propertyType,
        Location: location,
        imageUrl,
        listerId,
        created_at: createdAt,
        updated_at: updatedAt,
      }
    });

    return { isError: false, data: listing }
  } catch (e) {
    console.log("Error creating listing", e)
    return {isError: true, message: (e as Error).message};
  }
}

// export async function updateListing()

export async function getListingById(id: number): ActionResult<Listing> {
  try {
    const listing = await prisma.listing.findUniqueOrThrow({ where: { id}});
    return { isError: false, data: listing};
  } catch (e) {
    console.log("Error getting listing", e);
    return {isError: true, message: (e as Error).message };
  }
  
}

export async function deleteListing(id: number): ActionResult<Listing> {
  try {
    const listing = await prisma.listing.delete({ where: {id}});
    return { isError: false, data: listing}
  } catch (e) {
    console.log("Error deleting listing", e);
    return {isError: true, message: (e as Error).message };
  }
}


export async function getAllListings(): ActionResult<Listing[]> {
  try {
    const listings = await prisma.listing.findMany({
      orderBy: { created_at: 'desc'},
      include: {
        apartmentDetails: true,
        houseDetails: true,
        lister: true
      }
    });
    return {isError: false, data: listings};
  } catch (e) {
    console.log("Error returning all listings", e);
    return {isError: true, message: (e as Error).message };
  }
}

