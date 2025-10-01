import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { LoggerService } from '../services/logger.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = LoggerService.getLogger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() === 'http') {
      return this.logHttpCall(context, next);
    }
    return next.handle();
  }

  private logHttpCall(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url, body, params, query, headers } = req;
    const userAgent = headers['user-agent'] || '';
    const controller = context.getClass().name;
    const handler = context.getHandler().name;
    const startTime = Date.now();
    const requestId = headers['x-request-id'] || uuidv4();
    
    // Attach request ID to request and response
    req.requestId = requestId;
    const res = context.switchToHttp().getResponse();
    res.setHeader('x-request-id', requestId);
    
    // Log the incoming request (without body for security)
    this.logger.debug(`Incoming request: ${method} ${url}`, {
      requestId,
      method,
      url,
      controller,
      handler,
      params,
      query,
      userAgent
    });

    return next.handle().pipe(
      tap((data) => {
        const responseTime = Date.now() - startTime;
        
        // Log successful response
        this.logger.debug(`Response: ${method} ${url} [${responseTime}ms]`, {
          requestId,
          responseTime,
          statusCode: res.statusCode
        });
        
        return data;
      }),
      catchError(error => {
        const responseTime = Date.now() - startTime;
        
        // Determine error details
        const status = error instanceof HttpException ? error.getStatus() : 500;
        const errorResponse = error instanceof HttpException ? error.getResponse() : { message: error.message };
        
        // Log the error
        this.logger.error(`Error: ${method} ${url} [${responseTime}ms] - ${error.message}`, error, {
          requestId,
          responseTime,
          statusCode: status,
          errorResponse
        });
        
        throw error;
      })
    );
  }
}