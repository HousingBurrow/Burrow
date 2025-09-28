/*
  Warnings:

  - A unique constraint covering the columns `[stack_auth_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "stack_auth_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_stack_auth_id_key" ON "public"."User"("stack_auth_id");
