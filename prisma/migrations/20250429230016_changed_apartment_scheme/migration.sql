/*
  Warnings:

  - You are about to drop the column `residentsAmount` on the `Resident` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[entrance,apartmentNumber]` on the table `Apartment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Apartment" ADD COLUMN     "residentsAmount" INTEGER;

-- AlterTable
ALTER TABLE "Resident" DROP COLUMN "residentsAmount";

-- CreateIndex
CREATE UNIQUE INDEX "Apartment_entrance_apartmentNumber_key" ON "Apartment"("entrance", "apartmentNumber");
