/*
  Warnings:

  - Added the required column `Location` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `distance_in_miles` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageUrl` to the `Listing` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Location" AS ENUM ('Midtown', 'WestMidtown', 'HomePark', 'NorthAvenue');

-- AlterTable
ALTER TABLE "public"."Listing" ADD COLUMN     "Location" "public"."Location" NOT NULL,
ADD COLUMN     "distance_in_miles" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "imageUrl" TEXT NOT NULL;
