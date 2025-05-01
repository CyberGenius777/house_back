-- CreateTable
CREATE TABLE "residents" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "apartmentId" INTEGER NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "residentsAmount" INTEGER NOT NULL DEFAULT 1,
    "role" TEXT NOT NULL DEFAULT 'resident',
    "owner_type" TEXT NOT NULL DEFAULT 'owner',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "animals" TEXT[],

    CONSTRAINT "residents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apartments" (
    "id" SERIAL NOT NULL,
    "entrance" INTEGER NOT NULL,
    "floor" INTEGER NOT NULL,
    "flat" INTEGER NOT NULL,
    "square" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "apartments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "residents_phone_key" ON "residents"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "residents_email_key" ON "residents"("email");
