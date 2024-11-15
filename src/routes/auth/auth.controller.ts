import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import RouterConfig from 'src/helpers/constance/router.config';
import { AuthTokenDto } from './dto/auth-token.dto';
import { TRespToken } from './auth.type';
import { AuthQueryAuthorizationDto } from './dto/auth-query.dto';
import { Response } from 'express';

@Controller(RouterConfig.auth.path)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('authorize')
  async oauth2Authorize(
    @Req() req: Request,
    @Res() res: Response,
    @Query() queryDto: AuthQueryAuthorizationDto,
  ) {
    const sessionId = req['sessionId'];
    const urlAuthorize = await this.authService.getUrlAuthorize(sessionId, queryDto);
    res.redirect(`${urlAuthorize}`);
  }

  @Post('token')
  async token(
    @Req() req: Request,
    @Body() bodyDto: AuthTokenDto,
  ): Promise<TRespToken & { __ignoreFormatResp: boolean }> {
    const sessionId = req['sessionId'];
    const result: TRespToken = await this.authService.token(sessionId, bodyDto);
    return { ...result, __ignoreFormatResp: true };
  }
}
