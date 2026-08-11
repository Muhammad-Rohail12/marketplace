-- CreateEnum
CREATE TYPE "ShippingZoneCode" AS ENUM ('CONTIGUOUS_US', 'ALASKA', 'HAWAII', 'US_TERRITORIES', 'MILITARY');

-- CreateEnum
CREATE TYPE "ShippingClass" AS ENUM ('STANDARD', 'OVERSIZED', 'HEAVY', 'FRAGILE', 'HAZARDOUS_RESTRICTED');

-- DropIndex
DROP INDEX "carts_userId_key";

-- CreateTable
CREATE TABLE "shipping_methods" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "deliveryMinDays" INTEGER NOT NULL,
    "deliveryMaxDays" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shipping_methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seller_shipping_settings" (
    "id" SERIAL NOT NULL,
    "sellerId" INTEGER NOT NULL,
    "processingMinDays" INTEGER NOT NULL DEFAULT 1,
    "processingMaxDays" INTEGER NOT NULL DEFAULT 2,
    "freeShippingThreshold" DECIMAL(12,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seller_shipping_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipping_rates" (
    "id" SERIAL NOT NULL,
    "sellerId" INTEGER,
    "shippingMethodId" INTEGER NOT NULL,
    "zone" "ShippingZoneCode" NOT NULL,
    "flatRate" DECIMAL(12,2) NOT NULL,
    "freeShippingThreshold" DECIMAL(12,2),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shipping_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart_shipping_selections" (
    "id" SERIAL NOT NULL,
    "cartId" INTEGER NOT NULL,
    "storeId" INTEGER NOT NULL,
    "shippingMethodId" INTEGER NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "minDays" INTEGER NOT NULL,
    "maxDays" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cart_shipping_selections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shipping_methods_code_key" ON "shipping_methods"("code");

-- CreateIndex
CREATE UNIQUE INDEX "seller_shipping_settings_sellerId_key" ON "seller_shipping_settings"("sellerId");

-- CreateIndex
CREATE INDEX "shipping_rates_sellerId_idx" ON "shipping_rates"("sellerId");

-- CreateIndex
CREATE INDEX "shipping_rates_shippingMethodId_idx" ON "shipping_rates"("shippingMethodId");

-- CreateIndex
CREATE INDEX "shipping_rates_zone_idx" ON "shipping_rates"("zone");

-- CreateIndex
CREATE INDEX "cart_shipping_selections_cartId_idx" ON "cart_shipping_selections"("cartId");

-- CreateIndex
CREATE UNIQUE INDEX "cart_shipping_selections_cartId_storeId_key" ON "cart_shipping_selections"("cartId", "storeId");

-- AddForeignKey
ALTER TABLE "seller_shipping_settings" ADD CONSTRAINT "seller_shipping_settings_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "sellers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipping_rates" ADD CONSTRAINT "shipping_rates_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "sellers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipping_rates" ADD CONSTRAINT "shipping_rates_shippingMethodId_fkey" FOREIGN KEY ("shippingMethodId") REFERENCES "shipping_methods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_shipping_selections" ADD CONSTRAINT "cart_shipping_selections_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_shipping_selections" ADD CONSTRAINT "cart_shipping_selections_shippingMethodId_fkey" FOREIGN KEY ("shippingMethodId") REFERENCES "shipping_methods"("id") ON DELETE CASCADE ON UPDATE CASCADE;
