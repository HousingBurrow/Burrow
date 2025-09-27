'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '../lib/prisma';


// creating a listing with all fields inputted
export async function createListing(formData: FormData) {
  const title = String(formData.get('Title') || '');
  const address = String(formData.get('address') || '');
  const description = String(formData.get('description') || '');
  const property_type = String(formData.get('property_type') || 'APARTMENT') as 'APARTMENT' | 'HOUSE';
  const Location = String(formData.get('Location') || 'Midtown') as 'Midtown' | 'WestMidtown' | 'HomePark' | 'NorthAvenue';
  const distance_in_miles = String(formData.get('distance_in_miles') || '0');
  const price = String(formData.get('price') || '0');
  const num_rooms_available = Number(formData.get('num_rooms_available') || 0);
  const total_rooms = Number(formData.get('total_rooms') || 0);
  const number_roommates = Number(formData.get('number_roommates') || 0);
  const utilities_included = formData.get('utilities_included') === 'on';
  const SqFt = Number(formData.get('SqFt') || 0);
  const imageUrl = String(formData.get('imageUrl') || '');
  const start_date = new Date(String(formData.get('start_date') || new Date().toISOString()));
  const end_date = new Date(String(formData.get('end_date') || new Date().toISOString()));
  const listerId = Number(formData.get('listerId') || 0);

  // if something fails, it throws a basic error message
  if (!title || !address || !imageUrl || !listerId) {
    throw new Error('Missing required fields');
  }

  const room_type = formData.get('room_type') as 'SINGLE' | 'DOUBLE' | null;
  const apartment_type = formData.get('apartment_type') as
    | 'SixBySix' | 'FiveByFive' | 'FourByFour' | 'ThreeByThree' | 'TwoByTwo' | 'Studio' | 'FiveByThree' | 'FiveByFour' | null;

  const num_bathrooms = formData.get('num_bathrooms') as string | null;
  const num_rooms = formData.get('num_rooms') as string | null;

  const created = await prisma.listing.create({
    data: {
      Title: title,
      address,
      description,
      property_type,
      Location,
      distance_in_miles,
      price,
      num_rooms_available,
      total_rooms,
      number_roommates,
      utilities_included,
      SqFt,
      imageUrl,
      start_date,
      end_date,
      created_at: new Date(),
      updated_at: new Date(),
      listerId,

      apartmentDetails:
        property_type === 'APARTMENT' && room_type && apartment_type
          ? { create: { room_type, apartment_type } }
          : undefined,

      houseDetails:
        property_type === 'HOUSE' && num_bathrooms && num_rooms
          ? { create: { num_bathrooms, num_rooms: Number(num_rooms) } }
          : undefined,
    },
  });

  revalidatePath('/listings');
  redirect(`/listings/${created.id}`);
}
