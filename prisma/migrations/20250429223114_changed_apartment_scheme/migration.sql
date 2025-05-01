/*
  Warnings:

  - Added the required column `apartmentNumber` to the `Apartment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Apartment" ADD COLUMN     "apartmentNumber" INTEGER NOT NULL;
