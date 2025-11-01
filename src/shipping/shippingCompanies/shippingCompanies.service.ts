import { Injectable, Body } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { ShippingCompaniesInput } from '@/shipping/shippingCompanies/shippingCompanies.input';

@Injectable()
export class ShippingCompaniesService {
  constructor(private prisma: PrismaService) {}
 
  /**
   * 查询物流公司信息
   * @param cnCompanyName 
   * @param enCompanyName 
   * @param contactName 
   * @returns 
   */
  async fetchShippingCompaniesList( cnCompanyName?: string, enCompanyName?: string, contactName?: string) {
    try{
      // 构建动态查询条件
      const where: any = {};

      if (cnCompanyName) {
        where.sku = { contains: cnCompanyName, mode: 'insensitive' };
      }
      if (enCompanyName) {
        where.name = { contains: enCompanyName, mode: 'insensitive' };
      }
      if (contactName) {
        where.model = { contains: contactName, mode: 'insensitive' };
      }

      const res = await this.prisma.shippingCompany.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
      });
   
      return { success: true, message: '物流公司数据查询成功', data: res };
    }catch(error){
      return { success: false, message: '物流公司查询失败，服务器错误', error: error.message, data: [] }
    };
  }

  /**
   * 保存物流公司信息
   * @param body 
   * @returns 
   */
  async saveShippingCompanyList(@Body() body: ShippingCompaniesInput) {    
   try{
     console.log('saveShippingCompanyList收到数据', body);

    const data = {
      'cnCompanyName': body.cnCompanyName,
      'enCompanyName': body.enCompanyName,
      'code': body.code,
      'contactName': body.contactName,
      'contactPhone': body.contactPhone,
      'warehouseAddress': body.warehouseAddress,
      'canShipToAmazon': body.canShipToAmazon,
      'hasOverseasWarehouse': body.hasOverseasWarehouse,
      'country': body.country,
      'remark': body.remark,
    };

    // 写入 Neon 数据库
    const res = await this.prisma.shippingCompany.create({ data });
  
    console.log('上传数据', res);

    return { success: true, message: '物流公司信息已保存', data: res };
   }catch(error){
    return { success: false, message: '保存物流公司信息失败，服务器错误', error: error.message, data: [] }
   }
  }

  /**
   * 更新物流公司信息
   * @param body 
   * @returns 
   */
  async updateShippingCompanyList(@Body() body: ShippingCompaniesInput) {   
    try{
      const data = {
      'cnCompanyName': body.cnCompanyName,
      'enCompanyName': body.enCompanyName,
      'code': body.code,
      'contactName': body.contactName,
      'contactPhone': body.contactPhone,
      'warehouseAddress': body.warehouseAddress,
      'canShipToAmazon': body.canShipToAmazon,
      'hasOverseasWarehouse': body.hasOverseasWarehouse,
      'country': body.country,
      'remark': body.remark,
    };

    // 写入 Neon 数据库
    const res = await this.prisma.shippingCompany.update({ 
      where: { id: body.id},
      data
     });

    return { success: true, message: '数据已收到', data: res };
    }catch(error){
      return { success: false, message: '保存物流公司信息失败，服务器错误', error: error.message, data: [] }
    }
  }
}
