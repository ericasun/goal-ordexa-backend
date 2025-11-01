import { Module } from '@nestjs/common';
import { ProductsController } from "@/products/products.controller"
import { ProductsService } from '@/products/products.service';
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
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
