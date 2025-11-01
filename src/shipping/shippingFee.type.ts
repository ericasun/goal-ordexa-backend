import { PrismaClient } from '../../generated/prisma';
const prisma = new PrismaClient();

// 单个 Product 类型，从 Prisma 模型生成的类型
export type ShippingFeeType = Awaited<ReturnType<typeof prisma.shippingFee.findFirst>>;
