import { PrismaClient } from '@prisma/client';
import { ShippingFeeType } from "@/shipping/shippingFee.type"
const prisma = new PrismaClient();

// 单个 Product 类型，从 Prisma 模型生成的类型
export type ShippingCompaniesType = Awaited<ReturnType<typeof prisma.shippingCompany.findFirst>>;

