/*
  Warnings:

  - You are about to drop the column `flat` on the `Apartment` table. All the data in the column will be lost.
  - Added the required column `flatNumber` to the `Apartment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Apartment" DROP COLUMN "flat",
ADD COLUMN     "flatNumber" INTEGER NOT NULL,
ALTER COLUMN "entrance" DROP NOT NULL,
ALTER COLUMN "floor" DROP NOT NULL,
ALTER COLUMN "square" DROP NOT NULL;
