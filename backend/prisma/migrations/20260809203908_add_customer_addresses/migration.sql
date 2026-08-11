-- CreateEnum
CREATE TYPE "AddressLabel" AS ENUM ('HOME', 'WORK', 'OTHER');

-- AlterTable
ALTER TABLE "carts" ADD COLUMN     "selectedAddressId" INTEGER;

-- CreateTable
CREATE TABLE "addresses" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "label" "AddressLabel" NOT NULL DEFAULT 'HOME',
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "companyName" TEXT,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "city" TEXT NOT NULL,
    "stateCode" TEXT NOT NULL,
    "stateName" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL DEFAULT 'US',
    "phone" TEXT NOT NULL,
    "deliveryInstructions" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "addresses_userId_idx" ON "addresses"("userId");

-- CreateIndex
CREATE INDEX "addresses_isDefault_idx" ON "addresses"("isDefault");

-- CreateIndex
CREATE INDEX "addresses_countryCode_idx" ON "addresses"("countryCode");

-- CreateIndex
CREATE INDEX "addresses_stateCode_idx" ON "addresses"("stateCode");

-- CreateIndex
CREATE INDEX "addresses_postalCode_idx" ON "addresses"("postalCode");

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_selectedAddressId_fkey" FOREIGN KEY ("selectedAddressId") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
