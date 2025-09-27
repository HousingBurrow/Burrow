import { z } from "zod";

// Prisma enums → Zod enums
export const PropertyTypeEnum = z.enum(["APARTMENT", "HOUSE"]);
export const LocationEnum = z.enum([
  "Midtown",
  "WestMidtown",
  "HomePark",
  "NorthAvenue",
]);
export const RoomTypeEnum = z.enum(["SINGLE", "DOUBLE"]);
export const ApartmentTypeEnum = z.enum([
  "SixBySix",
  "FiveByFive",
  "FourByFour",
  "ThreeByThree",
  "TwoByTwo",
  "Studio",
  "FiveByThree",
  "FiveByFour",
]);

// ApartmentDetails schema
export const ApartmentDetailsSchema = z.object({
  id: z.number().int().optional(),
  listingId: z.number().int().optional(),
  roomType: RoomTypeEnum,
  apartmentType: ApartmentTypeEnum,
});

// HouseDetails schema
export const HouseDetailsSchema = z.object({
  id: z.number().int().optional(),
  listingId: z.number().int().optional(),
  numBathrooms: z.number(),
  numRooms: z.number().int(),
});

// Listing schema
export const ListingSchema = z.object({
  id: z.number().int().optional(),
  title: z.string(),
  address: z.string(),
  description: z.string(),
  propertyType: PropertyTypeEnum,
  location: LocationEnum,
  distanceInMiles: z.number(),

  price: z.number(),
  numRoomsAvailable: z.number().int(),
  totalRooms: z.number().int(),
  numberRoommates: z.number().int(),
  utilitiesIncluded: z.boolean(),
  sqft: z.number().int(),
  imageUrls: z.array(z.string()),

  startDate: z.date(),
  endDate: z.date(),
  createdAt: z.date().optional(), // usually handled by DB
  updatedAt: z.date().optional(),

  apartmentDetails: ApartmentDetailsSchema.optional(),
  houseDetails: HouseDetailsSchema.optional(),

  listerId: z.number().int(),
});

export type AppListing = z.infer<typeof ListingSchema>
