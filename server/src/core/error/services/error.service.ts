import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { LoggerService } from '../../logger/services/logger.service';
import { AppError } from '../app-error';
import { ErrorCode } from '../error-codes';

@Injectable()
export class ErrorService {
  private logger: any;
  
  constructor(private readonly loggerService: LoggerService) {
    this.logger = loggerService.forContext('ErrorService');
  }
  
  /**
   * Creates a standardized application error
   */
  createError(options: {
    code: ErrorCode;
    message: string;
    httpStatus: number;
    details?: any;
    request?: Request;
    cause?: Error;
  }): AppError {
    const { code, message, httpStatus, details, request, cause } = options;
    
    // Get trace ID and path from request if available
    const traceId = request?.headers?.['x-request-id'] as string;
    const path = request?.url;
    
    // Create AppError with all details
    return new AppError({
      code,
      message,
      httpStatus,
      details,
      traceId,
      path,
      cause,
    });
  }
  
  /**
   * Map common errors to standardized application errors
   */
  mapError(error: any, request?: Request): AppError {
    // If already an AppError, just return it
    if (error instanceof AppError) {
      return error;
    }
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      return this.createError({
        code: ErrorCode.VALIDATION_ERROR,
        message: 'Validation failed',
        httpStatus: 400,
        details: this.formatValidationError(error),
        request,
        cause: error,
      });
    }
    
    // Handle Mongoose duplicate key errors
    if (error.name === 'MongoError' && error.code === 11000) {
      return this.createError({
        code: ErrorCode.DUPLICATE_ENTRY,
        message: 'Duplicate entry found',
        httpStatus: 409,
        details: error.keyValue,
        request,
        cause: error,
      });
    }
    
    // Handle Mongoose CastErrors (invalid IDs, etc.)
    if (error.name === 'CastError') {
      return this.createError({
        code: ErrorCode.INVALID_DATA_FORMAT,
        message: `Invalid ${error.kind}`,
        httpStatus: 400,
        details: { path: error.path, value: error.value },
        request,
        cause: error,
      });
    }
    
    // Handle JWT errors
    if (error.name === 'JsonWebTokenError') {
      return this.createError({
        code: ErrorCode.INVALID_TOKEN,
        message: 'Invalid token',
        httpStatus: 401,
        request,
        cause: error,
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return this.createError({
        code: ErrorCode.TOKEN_EXPIRED,
        message: 'Token expired',
        httpStatus: 401,
        request,
        cause: error,
      });
    }
    
    // Handle NestJS HTTP exceptions based on status code
    if (error.status) {
      switch (error.status) {
        case 400:
          return this.createError({
            code: ErrorCode.BAD_REQUEST,
            message: error.message || 'Bad request',
            httpStatus: 400,
            details: error.response,
            request,
            cause: error,
          });
        case 401:
          return this.createError({
            code: ErrorCode.UNAUTHORIZED,
            message: error.message || 'Unauthorized',
            httpStatus: 401,
            request,
            cause: error,
          });
        case 403:
          return this.createError({
            code: ErrorCode.FORBIDDEN,
            message: error.message || 'Forbidden',
            httpStatus: 403,
            request,
            cause: error,
          });
        case 404:
          return this.createError({
            code: ErrorCode.NOT_FOUND,
            message: error.message || 'Not found',
            httpStatus: 404,
            request,
            cause: error,
          });
        case 409:
          return this.createError({
            code: ErrorCode.CONFLICT,
            message: error.message || 'Conflict',
            httpStatus: 409,
            request,
            cause: error,
          });
        default:
          // Handle other HTTP error codes
          return this.createError({
            code: error.status >= 500 ? ErrorCode.SERVICE_UNAVAILABLE : ErrorCode.UNKNOWN_ERROR,
            message: error.message || 'An error occurred',
            httpStatus: error.status,
            details: error.response,
            request,
            cause: error,
          });
      }
    }
    
    // Handle generic errors
    return this.createError({
      code: ErrorCode.UNKNOWN_ERROR,
      message: error.message || 'An unexpected error occurred',
      httpStatus: 500,
      request,
      cause: error,
    });
  }
  
  /**
   * Log an error with appropriate context and detail level
   */
  logError(error: Error | AppError, request?: Request): void {
    // Convert to AppError if not already
    const appError = error instanceof AppError 
      ? error 
      : this.mapError(error, request);
    
    // Get request context
    const reqInfo = request ? {
      method: request.method,
      url: request.url,
      ip: request.ip,
      userId: (request as any).user?.userId,
      tenantId: (request as any).tenantId,
    } : {};
    
    // Log with appropriate severity based on status code
    const meta = {
      errorCode: appError.code,
      traceId: appError.traceId,
      details: appError.details,
      ...reqInfo
    };
    
    if (appError.httpStatus >= 500) {
      this.logger.error(`[${appError.code}] ${appError.message}`, appError, meta);
    } else if (appError.httpStatus >= 400) {
      this.logger.warn(`[${appError.code}] ${appError.message}`, meta);
    } else {
      this.logger.info(`[${appError.code}] ${appError.message}`, meta);
    }
  }
  
  /**
   * Format validation errors into a more usable structure
   */
  private formatValidationError(error: any): Record<string, any> {
    const formattedErrors: Record<string, any> = {};
    
    if (error.errors) {
      Object.keys(error.errors).forEach((key) => {
        const err = error.errors[key];
        formattedErrors[key] = {
          message: err.message,
          type: err.kind,
          value: err.value,
        };
      });
    }
    
    return formattedErrors;
  }
  
  // Helper methods for common errors
  notFound(resource: string, id?: string, request?: Request): AppError {
    const message = id 
      ? `${resource} not found with id: ${id}` 
      : `${resource} not found`;
      
    return this.createError({
      code: ErrorCode.NOT_FOUND,
      message,
      httpStatus: 404,
      details: id ? { id } : undefined,
      request,
    });
  }
  
  unauthorized(message = 'Unauthorized', request?: Request): AppError {
    return this.createError({
      code: ErrorCode.UNAUTHORIZED,
      message,
      httpStatus: 401,
      request,
    });
  }
  
  forbidden(message = 'Forbidden', request?: Request): AppError {
    return this.createError({
      code: ErrorCode.FORBIDDEN,
      message,
      httpStatus: 403,
      request,
    });
  }
  
  badRequest(message = 'Bad request', details?: any, request?: Request): AppError {
    return this.createError({
      code: ErrorCode.BAD_REQUEST,
      message,
      httpStatus: 400,
      details,
      request,
    });
  }
  
  validationError(details: any, message = 'Validation failed', request?: Request): AppError {
    return this.createError({
      code: ErrorCode.VALIDATION_ERROR,
      message,
      httpStatus: 400,
      details,
      request,
    });
  }
  
  conflict(message = 'Conflict', details?: any, request?: Request): AppError {
    return this.createError({
      code: ErrorCode.CONFLICT,
      message,
      httpStatus: 409,
      details,
      request,
    });
  }
  
  databaseError(message = 'Database error', details?: any, request?: Request): AppError {
    return this.createError({
      code: ErrorCode.DATABASE_ERROR,
      message,
      httpStatus: 500,
      details,
      request,
    });
  }
  
  businessRuleViolation(message: string, details?: any, request?: Request): AppError {
    return this.createError({
      code: ErrorCode.BUSINESS_RULE_VIOLATION,
      message,
      httpStatus: 422,
      details,
      request,
    });
  }
  
  serviceUnavailable(message = 'Service unavailable', details?: any, request?: Request): AppError {
    return this.createError({
      code: ErrorCode.SERVICE_UNAVAILABLE,
      message,
      httpStatus: 503,
      details,
      request,
    });
  }
  
  tenantNotFound(tenantId: string, request?: Request): AppError {
    return this.createError({
      code: ErrorCode.TENANT_NOT_FOUND,
      message: `Tenant not found with id: ${tenantId}`,
      httpStatus: 404,
      details: { tenantId },
      request,
    });
  }
  
  // Notification-specific errors
  notificationDeliveryFailed(message = 'Failed to deliver notification', details?: any, request?: Request): AppError {
    return this.createError({
      code: ErrorCode.NOTIFICATION_DELIVERY_FAILED,
      message,
      httpStatus: 500,
      details,
      request,
    });
  }
  
  notificationTemplateError(message = 'Error with notification template', details?: any, request?: Request): AppError {
    return this.createError({
      code: ErrorCode.NOTIFICATION_TEMPLATE_ERROR,
      message,
      httpStatus: 400,
      details,
      request,
    });
  }
}