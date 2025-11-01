/*
  Warnings:

  - You are about to drop the column `height` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `length` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `width` on the `Product` table. All the data in the column will be lost.
  - Added the required column `productHeight` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productLength` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productWeight` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productWidth` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "height",
DROP COLUMN "length",
DROP COLUMN "weight",
DROP COLUMN "width",
ADD COLUMN     "productHeight" INTEGER NOT NULL,
ADD COLUMN     "productLength" INTEGER NOT NULL,
ADD COLUMN     "productWeight" INTEGER NOT NULL,
ADD COLUMN     "productWidth" INTEGER NOT NULL;
