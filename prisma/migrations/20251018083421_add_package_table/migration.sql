-- DropIndex
DROP INDEX "public"."ProductPackage_packingTemplateName_key";

-- AlterTable
ALTER TABLE "ProductPackage" ALTER COLUMN "packingTemplateName" DROP NOT NULL;
