import { Module } from '@nestjs/common';
import { ShippingCompaniesController } from "@/shipping/shippingCompanies/shippingCompanies.controller"
import { ShippingCompaniesService } from '@/shipping/shippingCompanies/shippingCompanies.service';
import { AmazonModule } from '@/amazon/amazon.module'; 
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@/prisma/prisma.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 让所有模块都能用 process.env
    }),
    AmazonModule,
    PrismaModule
  ],
  controllers: [ShippingCompaniesController],
  providers: [ShippingCompaniesService],
})
export class ShippingCompaniesModule {}
