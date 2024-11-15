import { Injectable } from '@nestjs/common';
import { AppLogger } from 'src/logs/app-logger';
import { TRespToken } from './auth.type';
import { AuthQueryAuthorizationDto } from './dto/auth-query.dto';
import { AuthTokenDto } from './dto/auth-token.dto';

@Injectable()
export class AuthService {
  constructor(private readonly logger: AppLogger) {}

  async getUrlAuthorize(
    sessionId: string,
    queryDto: AuthQueryAuthorizationDto,
  ): Promise<string> {
    const url = new URL(`http://localhost:3000`);
    for (const key of Object.keys(queryDto)) {
      url.searchParams.append(key, queryDto[key]);
    }

    return url.toString();
  }

  async token(sessionId: string, bodyDto: AuthTokenDto): Promise<TRespToken> {
    return {
      access_token: '',
      refresh_token: '',
      token_type: '',
      expires_in: '',
    };
  }
}
