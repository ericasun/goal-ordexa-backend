-- CreateTable
CREATE TABLE "CartonConfig" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "name" TEXT,
    "cartonLength" DOUBLE PRECISION NOT NULL,
    "cartonWidth" DOUBLE PRECISION NOT NULL,
    "cartonHeight" DOUBLE PRECISION NOT NULL,
    "cartonWeight" DOUBLE PRECISION NOT NULL,
    "unitsPerCarton" INTEGER NOT NULL,

    CONSTRAINT "CartonConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShippingFee" (
    "id" SERIAL NOT NULL,
    "cartonId" INTEGER NOT NULL,
    "company" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "costPerCarton" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "remark" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShippingFee_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CartonConfig" ADD CONSTRAINT "CartonConfig_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShippingFee" ADD CONSTRAINT "ShippingFee_cartonId_fkey" FOREIGN KEY ("cartonId") REFERENCES "CartonConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
