import { Controller, Get, Query } from '@nestjs/common';
import { S3Service } from './s3.service';

@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  // @Get('presign-url')
  // async getPresignUrl(
  //   @Query('filename') filename: string,
  //   @Query('contentType') contentType: string,
  // ) {
  //   return this.s3Service.getPresignedUrl(filename, contentType);
  // }
}
