'use server';

import { Location, type Listing, type PropertyType } from '@prisma/client';
import { ActionResult } from '../utils/action-result';
import { prisma } from '../../lib/prisma';
import { Action } from '@prisma/client/runtime/library';
import { describe } from 'node:test';
import { image } from 'framer-motion/client';
import { DataListItemLabelProps } from '@chakra-ui/react';

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