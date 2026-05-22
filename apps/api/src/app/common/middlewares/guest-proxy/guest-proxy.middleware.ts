import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class GuestProxyMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    const customHeader = req.headers['public'];

    if (customHeader === 'guest') {
      req.url = req.url.replace('/api', '/api/guest');
    }
    console.log('GuestProxyMiddleware - Modified URL:', req.url);
    next();
  }
}
