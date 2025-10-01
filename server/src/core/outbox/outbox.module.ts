import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ScheduleModule } from '@nestjs/schedule';


import { OutboxMessage, OutboxMessageSchema } from "./model/outbox-message.schema"
import { OutboxMessageDAO } from './daos/outbox-message.dao';
import { OutboxService } from './services/outbox.service';
import { OutboxQueueService } from './services/outbox-queue.service';
import { OutboxRecoveryService } from './services/outbox-recovery.service';
import { EmailProcessorService } from './processors/email-processor.service';
import { S3ProcessorService } from './processors/s3-processor.service';
import { BullTaskProcessorService } from './processors/bull-task-processor.service';
import { RabbitMQProcessorService } from './processors/rabbitmq-processor.service';
import { DistributedLockService } from '../service/distributed-lock.service';
import { LoggerModule } from '../logger/logger.module';
import { EmailModule } from '../../modules/email/mail.module';
import { BullQueueModule } from '../bull-queue.module';
// import { StorageModule } from '../storage/storage.module';
// import { MessagingModule } from '../messaging/messaging.module';
// import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [
    // Register the OutboxMessage schema with Mongoose
    MongooseModule.forFeature([
      { name: OutboxMessage.name, schema: OutboxMessageSchema }
    ]),
    
    // Configure Bull queues for different message types
    
    
    // Register specific queue configurations
    BullQueueModule,
    
    // Enable scheduled tasks
    ScheduleModule.forRoot(),
    
    // Import required modules
    LoggerModule,
    EmailModule,
    // StorageModule,
    // QueueModule,
    // MessagingModule
  ],
  
  // Register service providers
  providers: [
    OutboxMessageDAO,
    OutboxService,
    OutboxQueueService,
    OutboxRecoveryService,
    EmailProcessorService,
    S3ProcessorService,
    BullTaskProcessorService,
    RabbitMQProcessorService,
    DistributedLockService
  ],
  
  // Export services for use in other modules
  exports: [
    OutboxService,
    OutboxMessageDAO
  ]
})
export class OutboxModule {}