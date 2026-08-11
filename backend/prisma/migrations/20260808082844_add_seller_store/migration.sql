-- CreateEnum
CREATE TYPE "SellerStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'CLOSED');

-- CreateEnum
CREATE TYPE "StoreStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE', 'SUSPENDED', 'CLOSED');

-- CreateEnum
CREATE TYPE "StorePolicyType" AS ENUM ('RETURN', 'SHIPPING', 'CANCELLATION', 'PRIVACY', 'TERMS');

-- CreateTable
CREATE TABLE "sellers" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "status" "SellerStatus" NOT NULL DEFAULT 'ACTIVE',
    "approvedAt" TIMESTAMP(3),
    "suspendedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "sellers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stores" (
    "id" SERIAL NOT NULL,
    "sellerId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "shortDescription" TEXT,
    "description" TEXT,
    "logo" TEXT,
    "banner" TEXT,
    "icon" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "country" TEXT,
    "stateProvince" TEXT,
    "city" TEXT,
    "address" TEXT,
    "postalCode" TEXT,
    "status" "StoreStatus" NOT NULL DEFAULT 'DRAFT',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "showContactInformation" BOOLEAN NOT NULL DEFAULT true,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "stores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_policies" (
    "id" SERIAL NOT NULL,
    "storeId" INTEGER NOT NULL,
    "type" "StorePolicyType" NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "store_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_audit_events" (
    "id" SERIAL NOT NULL,
    "storeId" INTEGER NOT NULL,
    "actorId" INTEGER,
    "action" TEXT NOT NULL,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "store_audit_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sellers_userId_key" ON "sellers"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "stores_sellerId_key" ON "stores"("sellerId");

-- CreateIndex
CREATE UNIQUE INDEX "stores_slug_key" ON "stores"("slug");

-- CreateIndex
CREATE INDEX "stores_status_idx" ON "stores"("status");

-- CreateIndex
CREATE INDEX "stores_isFeatured_idx" ON "stores"("isFeatured");

-- CreateIndex
CREATE UNIQUE INDEX "store_policies_storeId_type_key" ON "store_policies"("storeId", "type");

-- CreateIndex
CREATE INDEX "store_audit_events_storeId_idx" ON "store_audit_events"("storeId");

-- AddForeignKey
ALTER TABLE "sellers" ADD CONSTRAINT "sellers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stores" ADD CONSTRAINT "stores_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "sellers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_policies" ADD CONSTRAINT "store_policies_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_audit_events" ADD CONSTRAINT "store_audit_events_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;
