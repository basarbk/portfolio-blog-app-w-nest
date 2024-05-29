import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { Pagination } from '../types';

export class PaginationMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    let page = +req.query.page || 0;
    let size = +req.query.size || 10;

    if (page < 0) {
      page = 0;
    }
    if (size < 1) {
      size = 1;
    }
    req['pagination'] = new Pagination(page, size);
    next();
  }
}
