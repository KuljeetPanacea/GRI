import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { MongoServerError } from "mongodb";
import { Response } from "express";

@Catch(MongoServerError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DatabaseExceptionFilter.name);

  catch(exception: MongoServerError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    this.logger.error(`Database Error: ${exception.message}`);

    let errorResponse;

    if (exception.code === 11000) {
      errorResponse = new ConflictException("Duplicate record found");
    } else {
      errorResponse = new InternalServerErrorException(
        "Database error occurred",
      );
    }

    response.status(errorResponse.getStatus()).json({
      statusCode: errorResponse.getStatus(),
      message: errorResponse.message,
      timestamp: new Date().toISOString(),
    });
  }
}
