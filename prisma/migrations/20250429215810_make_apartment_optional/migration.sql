-- DropForeignKey
ALTER TABLE "Resident" DROP CONSTRAINT "Resident_apartmentId_fkey";

-- AlterTable
ALTER TABLE "Resident" ALTER COLUMN "apartmentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Resident" ADD CONSTRAINT "Resident_apartmentId_fkey" FOREIGN KEY ("apartmentId") REFERENCES "Apartment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
