import { Controller,Post, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductAddInput, ProductSearchInput } from '@/products/product.input';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService, 
  ) {}

  @Post('save')
  async saveProductList(@Body() body: ProductAddInput) {
    return this.productsService.saveProductList(body)
  }

  @Post('update')
  async updateProductList(@Body() body: ProductAddInput) {
    return this.productsService.updateProductList(body)
  }

  @Post('fetch')
  async fetchProductsList(@Body() filters: ProductSearchInput) {
    return this.productsService.fetchProductsList(filters);
  }

  // @Post('image')
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadImage(@UploadedFile() file: Express.Multer.File) {
  //   const url = await this.productsService.uploadToS3(file);
  //   return { url };
  // }
}

