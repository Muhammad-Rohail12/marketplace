-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT');

-- CreateEnum
CREATE TYPE "PriceChangeType" AS ENUM ('INITIAL_PRICE', 'PRICE_UPDATE', 'DISCOUNT_CREATED', 'DISCOUNT_UPDATED', 'DISCOUNT_EXPIRED', 'DISCOUNT_DISABLED', 'DEAL_STARTED', 'DEAL_ENDED', 'ADMIN_ADJUSTMENT');

-- CreateTable
CREATE TABLE "product_prices" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "variantId" INTEGER,
    "sellerId" INTEGER NOT NULL,
    "storeId" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'PKR',
    "basePrice" DECIMAL(12,2) NOT NULL,
    "compareAtPrice" DECIMAL(12,2),
    "costPrice" DECIMAL(12,2),
    "minimumPrice" DECIMAL(12,2),
    "maximumPrice" DECIMAL(12,2),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "product_prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deals" (
    "id" SERIAL NOT NULL,
    "sellerId" INTEGER,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "deals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discounts" (
    "id" SERIAL NOT NULL,
    "dealId" INTEGER,
    "priceId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "variantId" INTEGER,
    "sellerId" INTEGER NOT NULL,
    "storeId" INTEGER NOT NULL,
    "type" "DiscountType" NOT NULL,
    "value" DECIMAL(12,2) NOT NULL,
    "startAt" TIMESTAMP(3),
    "endAt" TIMESTAMP(3),
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "maxUses" INTEGER,
    "currentUses" INTEGER NOT NULL DEFAULT 0,
    "minimumQuantity" INTEGER,
    "maximumQuantity" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "discounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "price_history" (
    "id" SERIAL NOT NULL,
    "priceId" INTEGER NOT NULL,
    "changeType" TEXT NOT NULL,
    "field" TEXT,
    "previousValue" DECIMAL(12,2),
    "newValue" DECIMAL(12,2),
    "reason" TEXT,
    "changedById" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "price_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_prices_variantId_key" ON "product_prices"("variantId");

-- CreateIndex
CREATE INDEX "product_prices_productId_idx" ON "product_prices"("productId");

-- CreateIndex
CREATE INDEX "product_prices_variantId_idx" ON "product_prices"("variantId");

-- CreateIndex
CREATE INDEX "product_prices_sellerId_idx" ON "product_prices"("sellerId");

-- CreateIndex
CREATE INDEX "product_prices_storeId_idx" ON "product_prices"("storeId");

-- CreateIndex
CREATE INDEX "product_prices_currency_idx" ON "product_prices"("currency");

-- CreateIndex
CREATE INDEX "product_prices_isActive_idx" ON "product_prices"("isActive");

-- CreateIndex
CREATE INDEX "deals_sellerId_idx" ON "deals"("sellerId");

-- CreateIndex
CREATE INDEX "deals_startAt_idx" ON "deals"("startAt");

-- CreateIndex
CREATE INDEX "deals_endAt_idx" ON "deals"("endAt");

-- CreateIndex
CREATE INDEX "discounts_dealId_idx" ON "discounts"("dealId");

-- CreateIndex
CREATE INDEX "discounts_priceId_idx" ON "discounts"("priceId");

-- CreateIndex
CREATE INDEX "discounts_productId_idx" ON "discounts"("productId");

-- CreateIndex
CREATE INDEX "discounts_variantId_idx" ON "discounts"("variantId");

-- CreateIndex
CREATE INDEX "discounts_sellerId_idx" ON "discounts"("sellerId");

-- CreateIndex
CREATE INDEX "discounts_storeId_idx" ON "discounts"("storeId");

-- CreateIndex
CREATE INDEX "discounts_startAt_idx" ON "discounts"("startAt");

-- CreateIndex
CREATE INDEX "discounts_endAt_idx" ON "discounts"("endAt");

-- CreateIndex
CREATE INDEX "discounts_isEnabled_idx" ON "discounts"("isEnabled");

-- CreateIndex
CREATE INDEX "price_history_priceId_idx" ON "price_history"("priceId");

-- CreateIndex
CREATE INDEX "price_history_createdAt_idx" ON "price_history"("createdAt");

-- AddForeignKey
ALTER TABLE "product_prices" ADD CONSTRAINT "product_prices_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_prices" ADD CONSTRAINT "product_prices_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "variant_combinations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discounts" ADD CONSTRAINT "discounts_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "deals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discounts" ADD CONSTRAINT "discounts_priceId_fkey" FOREIGN KEY ("priceId") REFERENCES "product_prices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discounts" ADD CONSTRAINT "discounts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discounts" ADD CONSTRAINT "discounts_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "variant_combinations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_history" ADD CONSTRAINT "price_history_priceId_fkey" FOREIGN KEY ("priceId") REFERENCES "product_prices"("id") ON DELETE CASCADE ON UPDATE CASCADE;
