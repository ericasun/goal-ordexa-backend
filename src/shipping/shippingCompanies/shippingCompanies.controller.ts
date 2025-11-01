import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ShippingCompaniesService } from '@/shipping/shippingCompanies/shippingCompanies.service';
import { PrismaService } from '@/prisma/prisma.service';
import { ShippingCompaniesInput } from '@/shipping/shippingCompanies/shippingCompanies.input';

@Controller('api/shippingCompanies')
export class ShippingCompaniesController {
  constructor(
    private readonly shippingCompaniesService: ShippingCompaniesService, 
    private readonly prisma: PrismaService
  ) {}
  
  @Get('fetch')
  async fetchShippingCompaniesServiceList(
    @Query('cnCompanyName') cnCompanyName?: string,
    @Query('enCompanyName') enCompanyName?: string,
    @Query('contactName') contactName?: string,
  ) {
    return this.shippingCompaniesService.fetchShippingCompaniesList(
      cnCompanyName, enCompanyName, contactName
    );
  }

  @Post('save')
  async saveShippingCompanyList(@Body() body: ShippingCompaniesInput) {
    return this.shippingCompaniesService.saveShippingCompanyList(body)
  }

  @Post('update')
  async updateShippingCompanyList(@Body() body: ShippingCompaniesInput) {
    return this.shippingCompaniesService.updateShippingCompanyList(body)
  }
}

