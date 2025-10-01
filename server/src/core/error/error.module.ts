import { Module, Global } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ErrorService } from './services/error.service';
import { LoggerModule } from '../logger/logger.module';
import { GlobalExceptionFilter } from './filters/global-exception.filter';

@Global()
@Module({
  imports: [LoggerModule],
  providers: [
    ErrorService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
  exports: [ErrorService],
})
export class ErrorModule {}
