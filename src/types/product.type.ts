import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// 单个 Product 类型，从 Prisma 模型生成的类型
export type ProductType = Awaited<ReturnType<typeof prisma.product.findFirst>>;

