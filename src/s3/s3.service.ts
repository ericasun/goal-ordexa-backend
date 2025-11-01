import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
  // private s3 = new S3Client({
  //   region: process.env.AWS_REGION,
  //   credentials: {
  //     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  //   },
  // });

  // async getPresignedUrl(filename: string, contentType: string) {
  //   const command = new PutObjectCommand({
  //     Bucket: process.env.AWS_S3_BUCKET,
  //     Key: `uploads/${Date.now()}-${filename}`,
  //     ContentType: contentType,
  //   });

  //   const uploadURL = await getSignedUrl(this.s3, command, { expiresIn: 60 }); // 链接有效 60 秒
  //   return { uploadURL };
  // }
}
