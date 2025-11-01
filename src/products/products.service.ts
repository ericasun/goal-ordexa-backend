// 产品
import { Injectable, Body } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { ProductAddInput, ProductSearchInput } from '@/products/product.input';
import * as AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  private s3 = new AWS.S3({
    // region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  async uploadToS3(file: Express.Multer.File) {
    const filename = `${uuid()}-${file.originalname}`;
    const bucket = process.env.AWS_S3_BUCKET;
    if (!bucket) {throw new Error("AWS_S3_BUCKET 没有配置");}

    const params = {
      Bucket: bucket,
      Key: filename,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const result = await this.s3.upload(params).promise();
    return result.Location; // 返回图片 URL
  }

  /**
   * 获取产品列表
   * @param filters 
   * @returns 
   */
  async fetchProductsList(filters: Partial<ProductSearchInput>) {
    console.log("----产品查询--", filters)
    try {      
      // 构建 Prisma where 条件
      const where: any = {};

      // id
      if(filters.id){
         where.id = filters.id;
      }
      
      // 产品名称、产品别名、sku、model（字符串字段 → 模糊匹配）
      ['productName', 'productAlias', 'sku', 'model'].forEach((key) => {
        const value = filters[key as keyof ProductSearchInput];
        if (value) {
          where[key] = { contains: value as string, mode: 'insensitive' };
        }
      });

      // 产品重量（数字范围）
      if (filters.productWeightMin !== undefined || filters.productWeightMax !== undefined) {
        where.productWeight = {};
        if (filters.productWeightMin !== undefined) {
          where.productWeight.gte = filters.productWeightMin;
        }
        if (filters.productWeightMax !== undefined) {
          where.productWeight.lte = filters.productWeightMax;
        } 
      }

      // 内箱模板名称
      if(filters.packingTemplateName){
        where.packages = { 
          some:{
            packingTemplateName:{
              contains: filters.packingTemplateName as string, 
              mode: 'insensitive' 
            }
          }
        };
      }

      // 外箱模板名称
      if(filters.cartonTemplateName){
        where.cartonConfigs = { 
          some:{
            cartonTemplateName:{
              contains: filters.packingTemplateName as string,  // 模糊匹配
              mode: 'insensitive'                               // 忽略大小写
            }
          }
        };
      }

      // 内箱重量
      if (filters.packageWeightMin || filters.packageWeightMax) {
        where.packages = {
          some: {
            packageWeight: {
              ...(filters.packageWeightMin ? { gte: filters.packageWeightMin } : {}),
              ...(filters.packageWeightMax ? { lte: filters.packageWeightMax } : {})
            }
          }
        };
      }

      // 外箱重量
      if (filters.cartonWeightMin !== undefined || filters.cartonWeightMax !== undefined) {
        where.cartonWeight = {};
        if (filters.cartonWeightMin !== undefined) {
          where.cartonWeight.gte = filters.cartonWeightMin;
        }
        if (filters.cartonWeightMax !== undefined) {
          where.cartonWeight.lte = filters.cartonWeightMax;
        } 
      }
      
      // 创建时间范围
      if (filters.createdAt && Array.isArray(filters.createdAt)) {
        const [start, end] = filters.createdAt;
        where.createdAt = {};
        if (start) {
          where.createdAt.gte = new Date(start);
        }
        if (end){
          where.createdAt.lte = new Date(end);
        } 
      }

      // 更新时间范围
      if (filters.updatedAt && Array.isArray(filters.updatedAt)) {
        const [start, end] = filters.updatedAt;
        where.updatedAt = {};
        if (start) {
          where.updatedAt.gte = new Date(start);
        }
        if (end){
          where.updatedAt.lte = new Date(end);
        } 
      }

      const res = await this.prisma.product.findMany({
        where,
        include: {
          packages: {  // 对应prisma表里定义的字段
            select: {
              id: true,
              packageLength: true,
              packageWidth: true,
              packageHeight: true,
              packageWeight: true,
              packingTemplateName: true,
              cartonConfigs: {  // 对应prisma表里定义的字段
                select: {
                  id: true,
                  cartonLength: true,
                  cartonWidth: true,
                  cartonHeight: true,
                  cartonWeight: true,
                  unitsPerCarton: true,
                  cartonTemplateName: true
                },
              }
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
      });
      
      console.log("=====查询结果===", res)
      return { success: true, message: '产品数据查询成功', data: res };
    } catch (error) {
      return { success: false, message: '产品查询失败，服务器错误', error: error.message, data: [] };
    }
  }

  /**
   * 保存产品信息
   * @param body 
   * @returns 
   */
  async saveProductList(@Body() body: ProductAddInput) {  
    try {
      const productData =  await this.prisma.$transaction(async (tx) => {
        // 保存产品
        const product = await tx.product.create({
          data: {
            productName: body.productName,
            sku: body.sku,
            model: body.model,
            productLength: Number(body.productLength),
            productWidth: Number(body.productWidth),
            productHeight: Number(body.productHeight),
            productWeight: Number(body.productWeight),
          }
        });

        // 循环创建包装及其外箱
        if(body.packages?.length){
          for (const pkgData of body.packages) {
            const pkg = await tx.productPackage.create({
              data: {
                productId: product.id,
                packageLength: Number(pkgData.packageLength),
                packageWidth: Number(pkgData.packageWidth),
                packageHeight: Number(pkgData.packageHeight),
                packageWeight: Number(pkgData.packageWeight),
                packingTemplateName: pkgData.packingTemplateName
              }
            });

            // 每个包装下的外箱
            if (pkgData.cartonConfigs?.length) {
              for (const carton of pkgData.cartonConfigs) {
                await tx.cartonConfig.create({
                  data: {
                    productId: product.id,
                    productPackageId: pkg.id,
                    cartonLength: Number(carton.cartonLength),
                    cartonWidth: Number(carton.cartonWidth),
                    cartonHeight: Number(carton.cartonHeight),
                    cartonWeight: Number(carton.cartonWeight),
                    unitsPerCarton: Number(carton.unitsPerCarton),
                    cartonTemplateName: carton.cartonTemplateName
                  }     
                })
              };
            }
          }
        }
      })

      return { success: true, message: '产品数据已保存',data:productData};
    } catch (error) {
      console.error(error.message);
      return { success: false, message: '产品数据保存失败，服务器错误', error: error.message, data: [] };
    }
  }

  /**
   * 修改数据
   * @param body
   * @returns 
   */
  async updateProductList(@Body() body: ProductAddInput) {   
    console.log("====接收的更新数据==",body);
    try {      
      const productData = {
        productName: body.productName,
        productAlias: body.productAlias,
        model: body.model,
        description: body.description,
        productLength: Number(body.productLength),
        productWidth: Number(body.productWidth),
        productHeight: Number(body.productHeight),
        productWeight: Number(body.productWeight),

        packages: {
          // 删除数据库中不在请求数据里的旧 package
          deleteMany: {
            id: { notIn: body.packages.filter(p => p.id).map(p => p.id) },
          },

          // 更新已有的 package
          update: body.packages
            .filter(p => p.id)
            .map(p => ({
              where: { id: p.id },
              data: {
                packingTemplateName: p.packingTemplateName,
                packageLength: Number(p.packageLength),
                packageWidth: Number(p.packageWidth),
                packageHeight: Number(p.packageHeight),
                packageWeight: Number(p.packageWeight),

                cartonConfigs: {
                  // 删除数据库中多余的 cartonConfigs
                  deleteMany: {
                    id: { notIn: p.cartonConfigs.filter(c => c.id).map(c => c.id) },
                  },
                  // 更新已有的 cartonConfigs
                  update: p.cartonConfigs
                    .filter(c => c.id)
                    .map(c => ({
                      where: { id: c.id },
                      data: {
                        cartonTemplateName: c.cartonTemplateName,
                        cartonLength: Number(c.cartonLength),
                        cartonWidth: Number(c.cartonWidth),
                        cartonHeight: Number(c.cartonHeight),
                        cartonWeight: Number(c.cartonWeight),
                        unitsPerCarton: Number(c.unitsPerCarton),
                      },
                    })),
                  // 新增 cartonConfigs 时必须指定 product 外键
                  create: p.cartonConfigs
                    .filter(c => !c.id)
                    .map(c => ({
                      cartonTemplateName: c.cartonTemplateName,
                      cartonLength: Number(c.cartonLength),
                      cartonWidth: Number(c.cartonWidth),
                      cartonHeight: Number(c.cartonHeight),
                      cartonWeight: Number(c.cartonWeight),
                      unitsPerCarton: Number(c.unitsPerCarton),
                      // 关键：嵌套 create 时，必须显式连接 product
                      product: { connect: { sku: body.sku } },
                    })),
                },
              },
            })),

          // 新增 package
          create: body.packages
            .filter(p => !p.id)
            .map(p => ({
              packingTemplateName: p.packingTemplateName,
              packageLength: Number(p.packageLength),
              packageWidth: Number(p.packageWidth),
              packageHeight: Number(p.packageHeight),
              packageWeight: Number(p.packageWeight),
              cartonConfigs: {
                create: p.cartonConfigs
                  .filter(c => !c.id)
                  .map(c => ({
                    cartonTemplateName: c.cartonTemplateName,
                    cartonLength: Number(c.cartonLength),
                    cartonWidth: Number(c.cartonWidth),
                    cartonHeight: Number(c.cartonHeight),
                    cartonWeight: Number(c.cartonWeight),
                    unitsPerCarton: Number(c.unitsPerCarton),
                    // 关键：嵌套 create 时手动指定 product 外键
                    product: { connect: { sku: body.sku } },
                  })),
              },
            })),
        },
      };

      console.log("===更新的数据===", productData)
      // 写入 Neon 数据库
      const res = await this.prisma.product.update({ 
        where: { sku: body.sku },
        data: productData,
        include: { 
          packages: true,
          cartonConfigs: true,
        },
      });

      return { success: true, message: '数据已修改', data: res };
    } catch (error) {
      return { success: false, message: '数据保存失败，服务器错误', error: error.message, data: [] };
    }
  }
}
