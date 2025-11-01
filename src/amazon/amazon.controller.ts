import { Controller, Get, Query, Redirect } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Controller('api/amazon')
export class AmazonController {
  constructor(private readonly httpService: HttpService) {}

  private clientId = process.env.LWA_CLIENT_ID;
  private clientSecret = process.env.LWA_CLIENT_SECRET;
  private redirectUri = process.env.LWA_REDIRECT_URI;

  /**
   * 第一步：跳转到亚马逊授权页
   */
  @Get('connect')
  @Redirect('', 302)
  connectAmazon() {
    const state = 'abc123'; // 随机防CSRF
    const url = `https://sellercentral.amazon.com/apps/authorize/consent?application_id=${this.clientId}&state=${state}&version=beta`;

    return { url };
  }

  /**
   * 第二步：亚马逊授权回调（Nest 原生 HTTP）
   */
  @Get('callback')
  async amazonCallback(@Query('spapi_oauth_code') code: string) {
    console.log("=====到amazon这了=====")
    if (!code) {
      return { message: '缺少授权码 spapi_oauth_code' };
    }

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: this.redirectUri || '',
      client_id: this.clientId || '',
      client_secret: this.clientSecret || '',
    });

    try {
      const response$ = this.httpService.post(
        'https://api.amazon.com/auth/o2/token',
        body,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );

      const { data } = await firstValueFrom(response$);

      return {
        message: '亚马逊授权成功',
        tokens: data,
      };
    } catch (error) {
      console.error(error.response?.data || error.message);
      return {
        message: '亚马逊授权失败',
        error: error.response?.data || error.message,
      };
    }
  }
}
