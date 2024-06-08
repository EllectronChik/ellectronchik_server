import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class LoggerConsumer implements NestMiddleware {
  use(req: Request, res: any, next: () => void) {
    console.log('Request: ', {
      headers: req.headers,
      body: req.body,
    });
    next();
  }
}
