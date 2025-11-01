import { Module } from '@nestjs/common';
import { ShippingFeeController } from "@/shipping/shippingFee/shippingFees.controller"
import { ShippingFeeService } from '@/shipping/shippingFee/shippingFees.service';
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
  controllers: [ShippingFeeController],
  providers: [ShippingFeeService],
})
export class ShippingFeeModule {}
