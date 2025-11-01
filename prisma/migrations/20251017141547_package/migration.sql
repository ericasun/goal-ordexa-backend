/*
  Warnings:

  - You are about to drop the column `packageHeight` on the `CartonConfig` table. All the data in the column will be lost.
  - You are about to drop the column `packageLength` on the `CartonConfig` table. All the data in the column will be lost.
  - You are about to drop the column `packageWeight` on the `CartonConfig` table. All the data in the column will be lost.
  - You are about to drop the column `packageWidth` on the `CartonConfig` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CartonConfig" DROP COLUMN "packageHeight",
DROP COLUMN "packageLength",
DROP COLUMN "packageWeight",
DROP COLUMN "packageWidth",
ADD COLUMN     "productPackageId" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "productCategory" TEXT;

-- CreateTable
CREATE TABLE "ProductPackage" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "packingTemplateName" TEXT NOT NULL,
    "packageLength" DOUBLE PRECISION NOT NULL,
    "packageWidth" DOUBLE PRECISION NOT NULL,
    "packageHeight" DOUBLE PRECISION NOT NULL,
    "packageWeight" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER,
    "label" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductPackage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductPackage_packingTemplateName_key" ON "ProductPackage"("packingTemplateName");

-- AddForeignKey
ALTER TABLE "ProductPackage" ADD CONSTRAINT "ProductPackage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartonConfig" ADD CONSTRAINT "CartonConfig_productPackageId_fkey" FOREIGN KEY ("productPackageId") REFERENCES "ProductPackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
