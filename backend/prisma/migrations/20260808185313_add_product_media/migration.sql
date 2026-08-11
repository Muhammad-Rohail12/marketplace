-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO_PLACEHOLDER', 'THREE_D_MODEL_PLACEHOLDER', 'VIEW_360_PLACEHOLDER');

-- CreateEnum
CREATE TYPE "MediaStatus" AS ENUM ('UPLOADING', 'ACTIVE', 'PROCESSING', 'FAILED', 'DELETED');

-- CreateTable
CREATE TABLE "product_media" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "variantId" INTEGER,
    "type" "MediaType" NOT NULL DEFAULT 'IMAGE',
    "url" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "originalFileName" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "altText" TEXT,
    "title" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "status" "MediaStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "product_media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "product_media_productId_idx" ON "product_media"("productId");

-- CreateIndex
CREATE INDEX "product_media_variantId_idx" ON "product_media"("variantId");

-- CreateIndex
CREATE INDEX "product_media_sortOrder_idx" ON "product_media"("sortOrder");

-- CreateIndex
CREATE INDEX "product_media_isPrimary_idx" ON "product_media"("isPrimary");

-- CreateIndex
CREATE INDEX "product_media_status_idx" ON "product_media"("status");

-- AddForeignKey
ALTER TABLE "product_media" ADD CONSTRAINT "product_media_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_media" ADD CONSTRAINT "product_media_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "variant_combinations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
