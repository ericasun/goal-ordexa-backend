import { CartonConfig } from '../../../generated/prisma';
import { Injectable, Body } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { ShippingFeeInput } from '@/shipping/shippingFee/shippingFee.input';

@Injectable()
export class ShippingFeeService {
  constructor(private prisma: PrismaService) {}

  async fetchShippingFeesList(sku?: string, name?: string, model?: string) {
    // 构建动态查询条件
    const where: any = {};

    if (sku) {
      where.sku = { contains: sku, mode: 'insensitive' };
    }
    if (name) {
      where.name = { contains: name, mode: 'insensitive' };
    }
    if (model) {
      where.model = { contains: model, mode: 'insensitive' };
    }

    return this.prisma.shippingFee.findMany({
      where,
      include: {
        product: {
          select: {
            productName: true,
            productAlias: true,
            sku: true,
            model: true
          },
        },
        carton: {     // 填在shippingFee表里的名字
          select: {
            unitsPerCarton: true,
            cartonTemplateName: true,
            cartonLength: true,
            cartonWidth: true,
            cartonHeight: true,
          },
        },
        company: {     
          select: {
            cnCompanyName: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async saveShippingFeeList(@Body() body: ShippingFeeInput) {    
    console.log('saveShippingFeeData收到数据', body);

    const data = {
      productSku: body.productSku,
      cartonConfigId: body.cartonConfigId,
      companyId: body.companyId,
      channel: body.channel,
      costPerCarton: Number(body.costPerCarton),
      country: body.country,
      currency: body.currency,
      address: body.address,
      startDate: new Date(),
      endDate: new Date()
    };

    console.log("====data====", data)

    // 写入 Neon 数据库
    const res = await this.prisma.shippingFee.create({ data });
  
    console.log('上传数据', res);

    return { success: true, message: '数据已收到', data: res };
  }

  async updateShippingFeeList(@Body() body: ShippingFeeInput) {   
    return ; 
    // const data = {
     
    // };

    // // 写入 Neon 数据库
    // const res = await this.prisma.product.create({ data });

    // return { success: true, message: '数据已收到', data: res };
  }
}
