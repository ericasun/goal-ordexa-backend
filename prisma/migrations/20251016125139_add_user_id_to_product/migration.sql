/*
  Warnings:

  - You are about to drop the column `name` on the `CartonConfig` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `alias` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `packageHeight` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `packageLength` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `packageWeight` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `packageWidth` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `cartonId` on the `ShippingFee` table. All the data in the column will be lost.
  - You are about to drop the column `company` on the `ShippingFee` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[packingTemplateName]` on the table `CartonConfig` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[productSku]` on the table `Inventory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `packageHeight` to the `CartonConfig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `packageLength` to the `CartonConfig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `packageWeight` to the `CartonConfig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `packageWidth` to the `CartonConfig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `packingTemplateName` to the `CartonConfig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `CartonConfig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productSku` to the `Inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productName` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `ShippingFee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cartonConfigId` to the `ShippingFee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `ShippingFee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `ShippingFee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productSku` to the `ShippingFee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ShippingFee` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Inventory" DROP CONSTRAINT "Inventory_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ShippingFee" DROP CONSTRAINT "ShippingFee_cartonId_fkey";

-- AlterTable
ALTER TABLE "CartonConfig" DROP COLUMN "name",
ADD COLUMN     "cartonModel" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "packageHeight" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "packageLength" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "packageWeight" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "packageWidth" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "packingTemplateName" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "Inventory" DROP COLUMN "productId",
ADD COLUMN     "productSku" TEXT NOT NULL,
ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "alias",
DROP COLUMN "name",
DROP COLUMN "packageHeight",
DROP COLUMN "packageLength",
DROP COLUMN "packageWeight",
DROP COLUMN "packageWidth",
ADD COLUMN     "productName" TEXT NOT NULL,
ADD COLUMN     "productAlias" TEXT,
ADD COLUMN     "userId" INTEGER,
ALTER COLUMN "productHeight" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "productLength" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "productWeight" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "productWidth" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "ShippingFee" DROP COLUMN "cartonId",
DROP COLUMN "company",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "cartonConfigId" INTEGER NOT NULL,
ADD COLUMN     "companyId" INTEGER NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "productSku" TEXT NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" INTEGER,
ALTER COLUMN "currency" DROP NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShippingCompany" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "cnCompanyName" TEXT NOT NULL,
    "enCompanyName" TEXT,
    "code" TEXT,
    "contactName" TEXT,
    "contactPhone" TEXT,
    "warehouseAddress" TEXT,
    "canShipToAmazon" BOOLEAN,
    "hasOverseasWarehouse" BOOLEAN,
    "country" TEXT,
    "remark" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShippingCompany_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ShippingCompany_cnCompanyName_key" ON "ShippingCompany"("cnCompanyName");

-- CreateIndex
CREATE UNIQUE INDEX "ShippingCompany_code_key" ON "ShippingCompany"("code");

-- CreateIndex
CREATE UNIQUE INDEX "CartonConfig_packingTemplateName_key" ON "CartonConfig"("packingTemplateName");

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_productSku_key" ON "Inventory"("productSku");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartonConfig" ADD CONSTRAINT "CartonConfig_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShippingCompany" ADD CONSTRAINT "ShippingCompany_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShippingFee" ADD CONSTRAINT "ShippingFee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShippingFee" ADD CONSTRAINT "ShippingFee_productSku_fkey" FOREIGN KEY ("productSku") REFERENCES "Product"("sku") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShippingFee" ADD CONSTRAINT "ShippingFee_cartonConfigId_fkey" FOREIGN KEY ("cartonConfigId") REFERENCES "CartonConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShippingFee" ADD CONSTRAINT "ShippingFee_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "ShippingCompany"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_productSku_fkey" FOREIGN KEY ("productSku") REFERENCES "Product"("sku") ON DELETE RESTRICT ON UPDATE CASCADE;
