import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';

// Import schemas
// import { Notification, NotificationSchema } from './schemas/notification.schema';
// import { NotificationDelivery, NotificationDeliverySchema } from './schemas/notification-delivery.schema';
// import { NotificationPreference, NotificationPreferenceSchema } from './schemas/notification-preference.schema';
// import { NotificationTemplate, NotificationTemplateSchema } from './schemas/notification-template.schema';
// import { NotificationDigestQueue, NotificationDigestQueueSchema } from './schemas/notification-digest-queue.schema';

// Import services
import { NotificationService } from './services/notification.service';
// import { EmailChannelService } from './services/channels/email-channel.service';
// import { InAppChannelService } from './services/channels/in-app-channel.service';
// import { WhatsAppChannelService } from './services/channels/whatsapp-channel.service';

// Import DAOs
// import { NotificationDAO } from './daos/notification.dao';
// import { NotificationDeliveryDAO } from './daos/notification-delivery.dao';
// import { NotificationPreferenceDAO } from './daos/notification-preference.dao';
// import { NotificationTemplateDAO } from './daos/notification-template.dao';
// import { NotificationDigestQueueDAO } from './daos/notification-digest-queue.dao';

// Import controllers
import { NotificationController } from './controllers/notification.controller';
import { NotificationTemplateController } from './controllers/notification-template.controller';
import { NotificationPreferenceController } from './controllers/notification-preference.controller';

// Import processor
import { NotificationProcessor } from './processors/notification-processor.service';

// Import gateway
import { NotificationGateway } from './gateways/notification.gateway';

// Import from core module
import { OutboxModule } from '../../core/outbox/outbox.module';
import { UserService } from '../user/services/user.service';
import { NotificationSchema } from './model/notification.schema';
// import { NotificationDelivery, NotificationDeliverySchema} from './model/notification-delivery.schema';
// import { NotificationPreference, NotificationPreferenceSchema } from './model/notification-preference.schema';
// import { NotificationTemplate, NotificationTemplateSchema } from './model/notification-template.schema';
// import { NotificationDigestQueue, NotificationDigestQueueSchema } from './model/notification-digest-queue.schema';
// import { EmailChannelService } from './services/email-channel.service';
import { InAppChannelService } from './services/in-app-channel.service';
import { NotificationDAO } from './daos/notification.dao';
// import { NotificationDeliveryDAO } from './daos/notification-delivery.dao';
import { NotificationPreferenceDAO } from './daos/notification-preference.dao';
import { NotificationTemplateDAO } from './daos/notification-template.dao';
import { NotificationDigestQueueDAO } from './daos/notification-digest-queue.dao';
import {Notification} from "../notifications/model/notification.schema"
import { PreferenceService } from './services/preference.service';
import { NotificationPreference, NotificationPreferenceSchema } from './model/notification-preference.schema';
import { TemplateService } from './services/template.service';
import { NotificationTemplate, NotificationTemplateSchema } from './model/notification-template.schema';
import { ErrorService } from 'src/core/error/services/error.service';
import { NotificationDeliveryDAO } from './daos/notification-delivery.dao';
import { NotificationDelivery, NotificationDeliverySchema } from './model/notification-delivery.schema';
import { NotificationDigestQueue, NotificationDigestQueueSchema } from './model/notification-digest-queue.schema';
import { DigestService } from './services/digest.service';
import { DistributedLockService } from 'src/core/service/distributed-lock.service';
import { EmailChannelService } from './services/email-channel.service';
import { UserModule } from '../user/user.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    // Register schemas
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
      { name: NotificationDelivery.name, schema: NotificationDeliverySchema },
      { name: NotificationPreference.name, schema: NotificationPreferenceSchema },
      { name: NotificationTemplate.name, schema: NotificationTemplateSchema },
      { name: NotificationDigestQueue.name, schema: NotificationDigestQueueSchema }
    ]),
    // Import outbox module
    OutboxModule,
    forwardRef(() =>UserModule)
  ],
  
  controllers: [
    NotificationController,
     NotificationTemplateController,
    NotificationPreferenceController
  ],
  
  providers: [
    // Services
    NotificationService,
    TemplateService,
    PreferenceService,
    ErrorService,
    DigestService,
    DistributedLockService,
    JwtService,
    // Channel services
    EmailChannelService,
    InAppChannelService,
    InAppChannelService,
    
    // DAOs
    NotificationDAO,
    NotificationDeliveryDAO,                                                                                     
     NotificationPreferenceDAO,
     NotificationTemplateDAO,
    NotificationDigestQueueDAO,
    
    // Processor
    NotificationProcessor,
    
    // Gateway
     NotificationGateway,
  ],
  
  exports: [
    NotificationService,
    NotificationTemplateDAO
  ]
})
export class NotificationModule {}