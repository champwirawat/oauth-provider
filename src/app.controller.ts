import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { AppService } from './app.service';

@Controller({
  version: VERSION_NEUTRAL,
})
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/ssr/info')
  async getAppInfo() {
    const result = this.appService.getAppInfo();
    return { ...result, __ignoreFormatResp: true };
  }
}
