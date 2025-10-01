import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import DOMPurify from 'isomorphic-dompurify';

@Injectable()
export class SanitizeMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    req.body = this.sanitize(req.body);
    req.query = this.sanitize(req.query);
    req.params = this.sanitize(req.params);
    next();
  }

  private sanitize(obj: any) {
    if (typeof obj === 'string') {
      return DOMPurify.sanitize(obj);
    } else if (obj && typeof obj === 'object') {
      for (const key in obj) {
        obj[key] = this.sanitize(obj[key]);
      }
    }
    return obj;
  }
}
