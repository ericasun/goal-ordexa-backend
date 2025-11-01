/*
  Warnings:

  - You are about to drop the column `productId` on the `CartonConfig` table. All the data in the column will be lost.
  - Added the required column `productSku` to the `CartonConfig` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."CartonConfig" DROP CONSTRAINT "CartonConfig_productId_fkey";

-- AlterTable
ALTER TABLE "CartonConfig" DROP COLUMN "productId",
ADD COLUMN     "productSku" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "CartonConfig" ADD CONSTRAINT "CartonConfig_productSku_fkey" FOREIGN KEY ("productSku") REFERENCES "Product"("sku") ON DELETE RESTRICT ON UPDATE CASCADE;
