/*
  Warnings:

  - You are about to drop the column `listingId` on the `ApartmentDetails` table. All the data in the column will be lost.
  - You are about to drop the column `listingId` on the `HouseDetails` table. All the data in the column will be lost.
  - You are about to drop the column `listerId` on the `Listing` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[listing_id]` on the table `ApartmentDetails` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[listing_id]` on the table `HouseDetails` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `listing_id` to the `ApartmentDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `listing_id` to the `HouseDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lister_id` to the `Listing` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."ApartmentDetails" DROP CONSTRAINT "ApartmentDetails_listingId_fkey";

-- DropForeignKey
ALTER TABLE "public"."HouseDetails" DROP CONSTRAINT "HouseDetails_listingId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Listing" DROP CONSTRAINT "Listing_listerId_fkey";

-- DropIndex
DROP INDEX "public"."ApartmentDetails_listingId_key";

-- DropIndex
DROP INDEX "public"."HouseDetails_listingId_key";

-- DropIndex
DROP INDEX "public"."Listing_listerId_idx";

-- AlterTable
ALTER TABLE "public"."ApartmentDetails" DROP COLUMN "listingId",
ADD COLUMN     "listing_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."HouseDetails" DROP COLUMN "listingId",
ADD COLUMN     "listing_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Listing" DROP COLUMN "listerId",
ADD COLUMN     "lister_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ApartmentDetails_listing_id_key" ON "public"."ApartmentDetails"("listing_id");

-- CreateIndex
CREATE UNIQUE INDEX "HouseDetails_listing_id_key" ON "public"."HouseDetails"("listing_id");

-- CreateIndex
CREATE INDEX "Listing_lister_id_idx" ON "public"."Listing"("lister_id");

-- AddForeignKey
ALTER TABLE "public"."Listing" ADD CONSTRAINT "Listing_lister_id_fkey" FOREIGN KEY ("lister_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ApartmentDetails" ADD CONSTRAINT "ApartmentDetails_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "public"."Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HouseDetails" ADD CONSTRAINT "HouseDetails_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "public"."Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
