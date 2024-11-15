import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ResponseConfig } from 'src/helpers/constance/response.config';
import { AppLogger } from 'src/logs/app-logger';

export interface Response<T> {}

@Injectable()
export class HttpFormatInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  constructor(private readonly logger: AppLogger) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const startTime = new Date();
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const contentLength = request.headers['content-length'] || 0;
    const sessionId = request['sessionId'];

    this.logger.log(
      sessionId,
      `request-start-${request.method.toLowerCase()}`,
      `content ${contentLength} bytes`,
    );
    return next.handle().pipe(
      map((data) => {
        const duration = new Date().getTime() - startTime.getTime();
        this.logger.log(
          sessionId,
          `response-success`,
          `${this.formatLog(request.method, request.url, response.statusCode, '0', duration)}`,
        );

        if (!!data?.__ignoreFormatResp) {
          delete data.__ignoreFormatResp;
          return data;
        }

        return { ...ResponseConfig.common.success, data };
      }),
      catchError((error) => {
        const duration = new Date().getTime() - startTime.getTime();
        const respCode = error.response?.code || error.status || 500;
        const errMessageEn =
          error.response?.msg?.en || error.response?.message || error.message;
        const errMessageTh = error.response?.msg?.th || errMessageEn;

        this.logger.error(
          sessionId,
          `response-error`,
          `${errMessageEn} - ${this.formatLog(request.method, request.url, error.status, respCode, duration)}`,
          error,
        );

        const response: any = {
          code: respCode,
          message: {
            en: errMessageEn,
            th: errMessageTh,
          },
        };
        return throwError(
          () =>
            new HttpException(response, error.status || 500, { cause: error }),
        );
      }),
    );
  }

  private formatLog(
    method: string,
    url: string,
    resStatus: string = '500',
    resCode: string = '0',
    duration: number,
  ) {
    return `(${method})${url} ${resStatus}:${resCode},${duration}ms`;
  }
}
