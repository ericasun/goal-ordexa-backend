import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AmazonModule } from './amazon/amazon.module'; 
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';

import { ProductsModule } from '@/products/products.module';
import { ShippingCompaniesModule } from '@/shipping/shippingCompanies/shippingCompanies.module';
import { ShippingFeeModule } from '@/shipping/shippingFee/shippingFees.module';

import { S3Module } from '@/s3/s3.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 让所有模块都能用 process.env
    }),
    AmazonModule,
    PrismaModule,
    ProductsModule,  
    ShippingCompaniesModule,
    ShippingFeeModule,
    S3Module,
    HttpModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
