-- CreateEnum
CREATE TYPE "AttributeType" AS ENUM ('TEXT', 'NUMBER', 'DECIMAL', 'BOOLEAN', 'COLOR', 'SIZE', 'DROPDOWN', 'MULTISELECT', 'DATE', 'MEASUREMENT', 'URL', 'RICH_TEXT', 'IMAGE_REFERENCE');

-- CreateEnum
CREATE TYPE "UnitType" AS ENUM ('WEIGHT', 'DIMENSION', 'VOLUME', 'COUNT');

-- CreateEnum
CREATE TYPE "BarcodeType" AS ENUM ('EAN13', 'UPC', 'CODE128', 'ISBN');

-- CreateEnum
CREATE TYPE "SpecGroup" AS ENUM ('GENERAL', 'TECHNICAL');

-- CreateTable
CREATE TABLE "attribute_groups" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attribute_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attributes" (
    "id" SERIAL NOT NULL,
    "groupId" INTEGER,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" "AttributeType" NOT NULL,
    "unitType" "UnitType",
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "isVariantAttribute" BOOLEAN NOT NULL DEFAULT false,
    "isFilterable" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "validationRules" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attribute_values" (
    "id" SERIAL NOT NULL,
    "attributeId" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "colorHex" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attribute_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category_attributes" (
    "id" SERIAL NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "attributeId" INTEGER NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "category_attributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "measurement_units" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "unitType" "UnitType" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "measurement_units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "variant_options" (
    "id" SERIAL NOT NULL,
    "attributeId" INTEGER NOT NULL,
    "attributeValueId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "variant_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "variant_combinations" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER,
    "name" TEXT NOT NULL,
    "sku" TEXT,
    "barcode" TEXT,
    "weight" DOUBLE PRECISION,
    "weightUnit" TEXT,
    "length" DOUBLE PRECISION,
    "width" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "dimensionUnit" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "variant_combinations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "variant_combination_options" (
    "id" SERIAL NOT NULL,
    "combinationId" INTEGER NOT NULL,
    "variantOptionId" INTEGER NOT NULL,

    CONSTRAINT "variant_combination_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_specification_templates" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "categoryId" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_specification_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "specification_template_items" (
    "id" SERIAL NOT NULL,
    "templateId" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "attributeId" INTEGER,
    "group" "SpecGroup" NOT NULL DEFAULT 'GENERAL',
    "displayOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "specification_template_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sku_configurations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "pattern" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sku_configurations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "barcode_configurations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "BarcodeType" NOT NULL,
    "prefix" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "barcode_configurations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "attribute_groups_slug_key" ON "attribute_groups"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "attributes_code_key" ON "attributes"("code");

-- CreateIndex
CREATE INDEX "attributes_groupId_idx" ON "attributes"("groupId");

-- CreateIndex
CREATE INDEX "attributes_type_idx" ON "attributes"("type");

-- CreateIndex
CREATE INDEX "attribute_values_attributeId_idx" ON "attribute_values"("attributeId");

-- CreateIndex
CREATE UNIQUE INDEX "attribute_values_attributeId_value_key" ON "attribute_values"("attributeId", "value");

-- CreateIndex
CREATE INDEX "category_attributes_categoryId_idx" ON "category_attributes"("categoryId");

-- CreateIndex
CREATE INDEX "category_attributes_attributeId_idx" ON "category_attributes"("attributeId");

-- CreateIndex
CREATE UNIQUE INDEX "category_attributes_categoryId_attributeId_key" ON "category_attributes"("categoryId", "attributeId");

-- CreateIndex
CREATE UNIQUE INDEX "measurement_units_code_key" ON "measurement_units"("code");

-- CreateIndex
CREATE INDEX "measurement_units_unitType_idx" ON "measurement_units"("unitType");

-- CreateIndex
CREATE UNIQUE INDEX "variant_options_attributeId_attributeValueId_key" ON "variant_options"("attributeId", "attributeValueId");

-- CreateIndex
CREATE UNIQUE INDEX "variant_combinations_sku_key" ON "variant_combinations"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "variant_combination_options_combinationId_variantOptionId_key" ON "variant_combination_options"("combinationId", "variantOptionId");

-- AddForeignKey
ALTER TABLE "attributes" ADD CONSTRAINT "attributes_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "attribute_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attribute_values" ADD CONSTRAINT "attribute_values_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "attributes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_attributes" ADD CONSTRAINT "category_attributes_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_attributes" ADD CONSTRAINT "category_attributes_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "attributes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "variant_options" ADD CONSTRAINT "variant_options_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "attributes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "variant_options" ADD CONSTRAINT "variant_options_attributeValueId_fkey" FOREIGN KEY ("attributeValueId") REFERENCES "attribute_values"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "variant_combination_options" ADD CONSTRAINT "variant_combination_options_combinationId_fkey" FOREIGN KEY ("combinationId") REFERENCES "variant_combinations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "variant_combination_options" ADD CONSTRAINT "variant_combination_options_variantOptionId_fkey" FOREIGN KEY ("variantOptionId") REFERENCES "variant_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_specification_templates" ADD CONSTRAINT "product_specification_templates_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "specification_template_items" ADD CONSTRAINT "specification_template_items_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "product_specification_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "specification_template_items" ADD CONSTRAINT "specification_template_items_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "attributes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
