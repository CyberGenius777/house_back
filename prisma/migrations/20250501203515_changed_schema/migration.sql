/*
  Warnings:

  - A unique constraint covering the columns `[apartmentNumber,entrance]` on the table `Apartment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Apartment_entrance_apartmentNumber_key";

-- CreateIndex
CREATE UNIQUE INDEX "Apartment_apartmentNumber_entrance_key" ON "Apartment"("apartmentNumber", "entrance");
