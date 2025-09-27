'use server';

import type { Listing, PropertyType } from '@/generated/prisma';
import { ActionResult } from '../utils/action-result';
import { prisma } from '../../lib/prisma';
import { Action } from '@prisma/client/runtime/library';
import { describe } from 'node:test';
import { image } from 'framer-motion/client';

interface CreateListingsProp {
  distance: number,
  address: string,
  description: string,
  startDate: Date,
  endDate: Date,
  numRoomsAvailable: number,
  totalRooms: number,
  title: string,
  price: number,
  utilitiesIncluded: boolean,
  sqFt: number,


  propertyType: PropertyType,
  location: Location,
  imageUrl: string,
  listerId: number,

}

export async function createListing({ distance, address, description, startDate, endDate, numRoomsAvailable, totalRooms, title, price, utilitiesIncluded, sqFt, propertyType, location, imageUrl, listerId }: CreateListingsProp): ActionResult<Listing> {
  try {
    const listing = await prisma.listing.create({
        data: {
        distance,
        address,
        description,
        startDate,
        endDate,
        numRoomsAvailable,
        totalRooms,
        title,
        price,
        utilitiesIncluded,
        sqFt,
        propertyType,
        location,
        imageUrl,
        listerId,
      }
    });

    return { isError: false, data: listing }
  } catch (e) {
    console.log("Error creating listing", e)
    return {isError: true, message: (e as Error).message};
  }
}

// export async function updateListing()