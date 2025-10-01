import { ErrorCode } from "./error-codes";

export class AppError extends Error {
    public readonly code: ErrorCode;
    public readonly httpStatus: number;
    public readonly details?: any;
    public readonly timestamp: Date;
    public readonly traceId?: string;
    public readonly path?: string;
    
    constructor(options: {
      code: ErrorCode;
      message: string;
      httpStatus: number;
      details?: any;
      traceId?: string;
      path?: string;
      cause?: Error;
    }) {
      super(options.message);
      
      this.code = options.code;
      this.httpStatus = options.httpStatus;
      this.details = options.details;
      this.timestamp = new Date();
      this.traceId = options.traceId;
      this.path = options.path;
      
      // Set the cause if provided (Node.js 16.9.0+)
      if (options.cause) {
        Object.defineProperty(this, 'cause', {
          value: options.cause,
          configurable: true,
          writable: true,
        });
      }
      
      // Maintain proper prototype chain
      Object.setPrototypeOf(this, AppError.prototype);
      
      // Capture stack trace
      Error.captureStackTrace(this, this.constructor);
    }
    
    toJSON(): Record<string, any> {
      return {
        code: this.code,
        message: this.message,
        details: this.details,
        timestamp: this.timestamp,
        traceId: this.traceId,
        path: this.path,
      };
    }
  }