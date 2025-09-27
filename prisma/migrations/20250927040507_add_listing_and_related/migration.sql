-- CreateEnum
CREATE TYPE "public"."PropertyType" AS ENUM ('APARTMENT', 'HOUSE');

-- CreateEnum
CREATE TYPE "public"."RoomType" AS ENUM ('SINGLE', 'DOUBLE');

-- CreateEnum
CREATE TYPE "public"."ApartmentType" AS ENUM ('SixBySix', 'FiveByFive', 'FourByFour', 'ThreeByThree', 'TwoByTwo', 'Studio', 'FiveByThree', 'FiveByFour');

-- CreateTable
CREATE TABLE "public"."Listing" (
    "id" SERIAL NOT NULL,
    "Title" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "property_type" "public"."PropertyType" NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "num_rooms_available" INTEGER NOT NULL,
    "total_rooms" INTEGER NOT NULL,
    "number_roommates" INTEGER NOT NULL,
    "utilities_included" BOOLEAN NOT NULL,
    "SqFt" INTEGER NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "listerId" INTEGER NOT NULL,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ApartmentDetails" (
    "id" SERIAL NOT NULL,
    "listingId" INTEGER NOT NULL,
    "room_type" "public"."RoomType" NOT NULL,
    "apartment_type" "public"."ApartmentType" NOT NULL,

    CONSTRAINT "ApartmentDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."HouseDetails" (
    "id" SERIAL NOT NULL,
    "listingId" INTEGER NOT NULL,
    "num_bathrooms" DECIMAL(65,30) NOT NULL,
    "num_rooms" INTEGER NOT NULL,

    CONSTRAINT "HouseDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Listing_listerId_idx" ON "public"."Listing"("listerId");

-- CreateIndex
CREATE INDEX "Listing_property_type_idx" ON "public"."Listing"("property_type");

-- CreateIndex
CREATE UNIQUE INDEX "ApartmentDetails_listingId_key" ON "public"."ApartmentDetails"("listingId");

-- CreateIndex
CREATE UNIQUE INDEX "HouseDetails_listingId_key" ON "public"."HouseDetails"("listingId");

-- CreateIndex
CREATE INDEX "User_last_name_idx" ON "public"."User"("last_name");

-- AddForeignKey
ALTER TABLE "public"."Listing" ADD CONSTRAINT "Listing_listerId_fkey" FOREIGN KEY ("listerId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ApartmentDetails" ADD CONSTRAINT "ApartmentDetails_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "public"."Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HouseDetails" ADD CONSTRAINT "HouseDetails_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "public"."Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
