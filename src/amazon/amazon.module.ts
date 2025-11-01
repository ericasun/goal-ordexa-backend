// src/amazon/amazon.module.ts
import { Module } from '@nestjs/common';
import { AmazonController } from './amazon.controller';
import { AmazonService } from './amazon.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule], 
  controllers: [AmazonController],
  providers: [AmazonService],
})
export class AmazonModule {}
