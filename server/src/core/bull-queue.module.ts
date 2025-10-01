import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    BullModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            redis: {
              host: configService.get('REDIS_HOST', 'localhost'),
              port: configService.get<number>('REDIS_PORT', 6379),
              password: configService.get('REDIS_PASSWORD', ''),
              db: configService.get<number>('REDIS_DB', 0),
              // High availability settings
              //enableReadyCheck: true,
             // maxRetriesPerRequest: 3,
              connectTimeout: 10000,
              // TLS configuration if needed
              tls: configService.get('REDIS_USE_TLS') === 'true' ? {
                rejectUnauthorized: false
              } : undefined
            },
            defaultJobOptions: {
              removeOnComplete: true,
              removeOnFail: true,
            },
          }),
        }),
    BullModule.registerQueue(
      { 
        name: 'email-processor', 
        limiter: { max: 50, duration: 1000 },
        defaultJobOptions: {
          attempts: 1,
          removeOnComplete: true,
          removeOnFail: true,
        }
      },
      { 
        name: 's3-upload-processor', 
        limiter: { max: 10, duration: 1000 },
        defaultJobOptions: {
          attempts: 1,
          removeOnComplete: true,
          removeOnFail: true,
        }
      },
      { 
        name: 'rabbitmq-processor',
        defaultJobOptions: {
          attempts: 1,
          removeOnComplete: true,
          removeOnFail: true,
        }
      },
      { 
        name: 'bull-task-processor',
        defaultJobOptions: {
          attempts: 1,
          removeOnComplete: true,
          removeOnFail: true,
        }
      },
      {
        name: 'notification-processor',
        limiter: { max: 50, duration: 1000 },
        defaultJobOptions: {
          attempts: 1,
          removeOnComplete: true,
          removeOnFail: true,
        },
      },
      {
        name: 'ai-processor',
        defaultJobOptions: {
          attempts: 1,
          removeOnComplete: true,
          removeOnFail: true,
        },
      },
      {
        name: 'audit-log-processor',
        defaultJobOptions: {
          attempts: 1,
          removeOnComplete: true,
          removeOnFail: true,
        },
      }
    ),
  ],
  exports: [BullModule],
})
export class BullQueueModule {}
