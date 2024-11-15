import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { customAlphabet } from 'nanoid';

@Injectable()
export class SessionIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    req['sessionId'] = `${customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789')()}|${req.method.toLocaleLowerCase()}.${req.baseUrl.replace(/^\//, '').replace(/\//g, '.')}`;
    next();
  }
}
