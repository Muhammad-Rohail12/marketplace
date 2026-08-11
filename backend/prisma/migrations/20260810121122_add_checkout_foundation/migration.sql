-- CreateEnum
CREATE TYPE "CheckoutSessionStatus" AS ENUM ('DRAFT', 'READY_FOR_PAYMENT', 'EXPIRED', 'ABANDONED', 'CONVERTED');

-- CreateEnum
CREATE TYPE "TaxRateType" AS ENUM ('STATE_FLAT');

-- CreateTable
CREATE TABLE "state_tax_rates" (
    "id" SERIAL NOT NULL,
    "stateCode" TEXT NOT NULL,
    "rate" DECIMAL(6,4) NOT NULL,
    "type" "TaxRateType" NOT NULL DEFAULT 'STATE_FLAT',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "state_tax_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checkout_sessions" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "cartId" INTEGER NOT NULL,
    "status" "CheckoutSessionStatus" NOT NULL DEFAULT 'DRAFT',
    "addressId" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "itemsSubtotal" DECIMAL(12,2) NOT NULL,
    "discountTotal" DECIMAL(12,2) NOT NULL,
    "shippingTotal" DECIMAL(12,2) NOT NULL,
    "taxTotal" DECIMAL(12,2) NOT NULL,
    "grandTotal" DECIMAL(12,2) NOT NULL,
    "taxStateCode" TEXT NOT NULL,
    "taxRateSnapshot" DECIMAL(6,4) NOT NULL,
    "snapshotJson" TEXT NOT NULL,
    "reservationExpiresAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "convertedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "checkout_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checkout_inventory_reservations" (
    "id" SERIAL NOT NULL,
    "checkoutSessionId" INTEGER NOT NULL,
    "inventoryId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "releasedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "checkout_inventory_reservations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "state_tax_rates_stateCode_key" ON "state_tax_rates"("stateCode");

-- CreateIndex
CREATE INDEX "state_tax_rates_stateCode_idx" ON "state_tax_rates"("stateCode");

-- CreateIndex
CREATE INDEX "checkout_sessions_userId_idx" ON "checkout_sessions"("userId");

-- CreateIndex
CREATE INDEX "checkout_sessions_status_idx" ON "checkout_sessions"("status");

-- CreateIndex
CREATE INDEX "checkout_sessions_expiresAt_idx" ON "checkout_sessions"("expiresAt");

-- CreateIndex
CREATE INDEX "checkout_inventory_reservations_checkoutSessionId_idx" ON "checkout_inventory_reservations"("checkoutSessionId");

-- CreateIndex
CREATE INDEX "checkout_inventory_reservations_inventoryId_idx" ON "checkout_inventory_reservations"("inventoryId");

-- AddForeignKey
ALTER TABLE "checkout_sessions" ADD CONSTRAINT "checkout_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checkout_inventory_reservations" ADD CONSTRAINT "checkout_inventory_reservations_checkoutSessionId_fkey" FOREIGN KEY ("checkoutSessionId") REFERENCES "checkout_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
