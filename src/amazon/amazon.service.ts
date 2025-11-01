import { Injectable } from '@nestjs/common';
const SellingPartnerAPI = require('amazon-sp-api');

@Injectable()
export class AmazonService {
  private spApi: any;

  constructor() {
    this.spApi = new SellingPartnerAPI({
      region: 'na', // 美国站，eu = 欧洲，fe = 日本
      refresh_token: process.env.SPAPI_REFRESH_TOKEN,
      credentials: {
        SELLING_PARTNER_APP_CLIENT_ID: process.env.SPAPI_CLIENT_ID,
        SELLING_PARTNER_APP_CLIENT_SECRET: process.env.SPAPI_CLIENT_SECRET,
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
        AWS_SELLING_PARTNER_ROLE: process.env.AWS_SELLING_PARTNER_ROLE,
      },
    });
  }

  async getOrders() {
    try {
      const result = await this.spApi.callAPI({
        operation: 'getOrders',
        endpoint: 'orders', 
        query: {
          MarketplaceIds: ['ATVPDKIKX0DER'], // 美国站点，注意换成你授权的站点 ID
          CreatedAfter: '2024-01-01T00:00:00Z', // 获取最近订单
        },
      });

      return result;
    } catch (error) {
      console.error('获取订单失败：', error);
      throw error;
    }
  }
}


console.log('refresh_token:', process.env.SPAPI_REFRESH_TOKEN);
