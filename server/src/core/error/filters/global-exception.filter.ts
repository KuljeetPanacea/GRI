// core/error/filters/global-exception.filter.ts
import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Injectable,
  } from '@nestjs/common';
  import { Request, Response } from 'express';
import { ErrorService } from '../services/error.service';
import { AppError } from '../app-error';
import { ErrorCode } from '../error-codes';

  
  // Define interface for error responses
  interface ErrorResponse {
    statusCode?: number;
    message?: string | string[];
    error?: string;
    [key: string]: any;
  }
  
  @Injectable()
  @Catch()
  export class GlobalExceptionFilter implements ExceptionFilter {
    constructor(private readonly errorService: ErrorService) {}
  
    catch(exception: unknown, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
      
      // Handle the exception
      let appError: AppError;
      
      // Map exception to an AppError
      if (exception instanceof AppError) {
        // Already an AppError, use as is
        appError = exception;
      } else if (exception instanceof HttpException) {
        // Map NestJS HTTP exceptions
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();
        
        // Cast the exception response to our interface
        const details: ErrorResponse = typeof exceptionResponse === 'object'
          ? exceptionResponse as ErrorResponse
          : { message: exceptionResponse as string };
          
        const message = details.message 
          ? Array.isArray(details.message) 
            ? details.message.join(', ') 
            : details.message.toString()
          : 'An error occurred';
        
        appError = this.errorService.createError({
          code: this.mapHttpStatusToErrorCode(status),
          message,
          httpStatus: status,
          details: details,
          request,
          cause: exception as Error,
        });
      } else {
        // Map any other exception
        appError = this.errorService.mapError(exception, request);
      }
      
      // Log the error
      this.errorService.logError(appError, request);
      
      // Return standardized error response
      response
        .status(appError.httpStatus)
        .json({
          code: appError.code,
          message: appError.message,
          details: appError.details,
          timestamp: appError.timestamp,
          traceId: appError.traceId || request.headers['x-request-id'],
          path: appError.path || request.url,
        });
    }
    
    private mapHttpStatusToErrorCode(status: number): ErrorCode {
      switch (status) {
        case HttpStatus.BAD_REQUEST:
          return ErrorCode.BAD_REQUEST;
        case HttpStatus.UNAUTHORIZED:
          return ErrorCode.UNAUTHORIZED;
        case HttpStatus.FORBIDDEN:
          return ErrorCode.FORBIDDEN;
        case HttpStatus.NOT_FOUND:
          return ErrorCode.NOT_FOUND;
        case HttpStatus.CONFLICT:
          return ErrorCode.CONFLICT;
        case HttpStatus.UNPROCESSABLE_ENTITY:
          return ErrorCode.BUSINESS_RULE_VIOLATION;
        case HttpStatus.SERVICE_UNAVAILABLE:
          return ErrorCode.SERVICE_UNAVAILABLE;
        case HttpStatus.GATEWAY_TIMEOUT:
          return ErrorCode.TIMEOUT;
        default:
          return status >= 500 ? ErrorCode.SERVICE_UNAVAILABLE : ErrorCode.UNKNOWN_ERROR;
      }
    }
  }