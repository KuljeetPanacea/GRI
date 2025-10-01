import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { LoggerService } from '../services/logger.service';
import { RequestContext, RequestContextData } from 'src/core/contexts/request.context';

/**
 * Middleware to add request-specific information to the
 * request object and headers for consistent logging
 */
@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  private logger = LoggerService.getLogger('HTTP');

  async use(req: Request, res: Response, next: NextFunction) {
    // Add request ID if not present
    const requestId = req.headers['x-request-id'] as string || uuidv4();
    req.headers['x-request-id'] = requestId;
    res.setHeader('x-request-id', requestId);
    
    // Create request context data
    const requestContextData: RequestContextData = {
      requestId,
      url: req.url,
      method: req.method,
      startTime: Date.now(),
      ip: req.ip,
      userAgent: req.headers['user-agent'] as string
    };
    
    // Run the request in context
    await RequestContext.getInstance().run(requestContextData, async () => {
      // Log the start of the request
      this.logger.debug(`Request started: ${req.method} ${req.url}`, {
        method: req.method,
        url: req.url,
        requestId: requestId,
        ip: requestContextData.ip,
        userAgent: requestContextData.userAgent
      });
      
      // Response finish logic
      res.on('finish', () => {
        const duration = Date.now() - requestContextData.startTime;

        if (!res.headersSent) {
          res.setHeader('x-response-time', `${duration}ms`);
        }

        // Log request completion
        this.logger.debug(`Request completed: ${req.method} ${req.url} [${res.statusCode}] ${duration}ms`, {
          method: req.method,
          url: req.url,
          statusCode: res.statusCode,
          duration,
          requestId
        });
      });
      
      next();
    });
  }
}
