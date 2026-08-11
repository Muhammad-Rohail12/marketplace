-- CreateEnum
CREATE TYPE "InventoryStatus" AS ENUM ('IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK', 'BACKORDER', 'DISCONTINUED');

-- CreateEnum
CREATE TYPE "StockMovementType" AS ENUM ('INITIAL_STOCK', 'RESTOCK', 'MANUAL_ADJUSTMENT', 'RESERVATION', 'RELEASE', 'SALE', 'RETURN', 'DAMAGE', 'LOSS', 'CORRECTION', 'TRANSFER_PLACEHOLDER');

-- CreateTable
CREATE TABLE "inventories" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "variantId" INTEGER,
    "sellerId" INTEGER NOT NULL,
    "storeId" INTEGER NOT NULL,
    "sku" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "reservedQuantity" INTEGER NOT NULL DEFAULT 0,
    "lowStockThreshold" INTEGER NOT NULL DEFAULT 5,
    "reorderPoint" INTEGER NOT NULL DEFAULT 0,
    "status" "InventoryStatus" NOT NULL DEFAULT 'OUT_OF_STOCK',
    "allowBackorder" BOOLEAN NOT NULL DEFAULT false,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "inventories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_movements" (
    "id" SERIAL NOT NULL,
    "inventoryId" INTEGER NOT NULL,
    "type" "StockMovementType" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "previousQuantity" INTEGER NOT NULL,
    "newQuantity" INTEGER NOT NULL,
    "reason" TEXT,
    "referenceType" TEXT,
    "referenceId" INTEGER,
    "performedById" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stock_movements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "inventories_variantId_key" ON "inventories"("variantId");

-- CreateIndex
CREATE INDEX "inventories_productId_idx" ON "inventories"("productId");

-- CreateIndex
CREATE INDEX "inventories_variantId_idx" ON "inventories"("variantId");

-- CreateIndex
CREATE INDEX "inventories_sellerId_idx" ON "inventories"("sellerId");

-- CreateIndex
CREATE INDEX "inventories_storeId_idx" ON "inventories"("storeId");

-- CreateIndex
CREATE INDEX "inventories_sku_idx" ON "inventories"("sku");

-- CreateIndex
CREATE INDEX "inventories_status_idx" ON "inventories"("status");

-- CreateIndex
CREATE INDEX "stock_movements_inventoryId_idx" ON "stock_movements"("inventoryId");

-- CreateIndex
CREATE INDEX "stock_movements_type_idx" ON "stock_movements"("type");

-- CreateIndex
CREATE INDEX "stock_movements_createdAt_idx" ON "stock_movements"("createdAt");

-- CreateIndex
CREATE INDEX "stock_movements_referenceId_idx" ON "stock_movements"("referenceId");

-- AddForeignKey
ALTER TABLE "inventories" ADD CONSTRAINT "inventories_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventories" ADD CONSTRAINT "inventories_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "variant_combinations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "inventories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
