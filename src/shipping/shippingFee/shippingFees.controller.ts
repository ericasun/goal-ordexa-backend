import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ShippingFeeService } from '@/shipping/shippingFee/shippingFees.service';
import { PrismaService } from '@/prisma/prisma.service';
import { ShippingFeeInput } from '@/shipping/shippingFee/shippingFee.input';

@Controller('api/shippingFees')
export class ShippingFeeController {
  constructor(
    private readonly shippingFeeService: ShippingFeeService, 
    private readonly prisma: PrismaService
  ) {}
  
  @Get('fetch')
  async fetchShippingFeesList(
    @Query('sku') sku?: string,
    @Query('name') name?: string,
    @Query('model') model?: string,
  ) {
    return this.shippingFeeService.fetchShippingFeesList(sku, name, model);
  }

  @Post('save')
  async saveShippingFeeList(@Body() body: ShippingFeeInput) {
    return this.shippingFeeService.saveShippingFeeList(body)
  }

  @Post('update')
  async updateShippingFeeList(@Body() body: ShippingFeeInput) {
    return this.shippingFeeService.updateShippingFeeList(body)
  }
}

