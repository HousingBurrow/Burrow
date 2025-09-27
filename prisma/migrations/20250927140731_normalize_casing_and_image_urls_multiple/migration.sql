/*
  Warnings:

  - You are about to drop the column `Location` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `SqFt` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `Title` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Listing` table. All the data in the column will be lost.
  - Added the required column `location` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sqft` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Listing` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Listing" DROP COLUMN "Location",
DROP COLUMN "SqFt",
DROP COLUMN "Title",
DROP COLUMN "imageUrl",
ADD COLUMN     "imageUrls" TEXT[],
ADD COLUMN     "location" "public"."Location" NOT NULL,
ADD COLUMN     "sqft" INTEGER NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;
