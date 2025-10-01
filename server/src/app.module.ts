import { MiddlewareConsumer, Module } from "@nestjs/common";
import { DatabaseModule } from "./core/database/database.module";
import { UserModule } from "./modules/user/user.module";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./modules/authentication/AuthModule";
import { ProjectModule } from "./modules/project/project.module";
import { ClientModule } from "./modules/client/client.module";
import { AuthContextMiddleware } from "./core/guards/auth-context.middleware";
import { RequestContextMiddleware } from "./core/logger/middleware/request-context.middleware";
import { NotificationModule } from "./modules/notifications/notification.module";
import { QuestionnaireModule } from "./modules/questionaire/questionnaire.module";
import { LookupModule } from "./modules/lookup/lookup.module";
import { SystemTemplateModule } from "./modules/systemtemplate/systemTemplate.module";
import { S3Module } from "./modules/s3/s3.module";
import { AssessmentTaskModule } from "./modules/assessmentTask/assessmentTask.module";
import { RocAssetControlModule } from "./modules/rocAssetControl/rocAssetControl.module";
import { RocControlFindingModule } from "./modules/RocControlFinding/rocControlFinding.module";
import { RocAssetControlQstnModule } from "./modules/rocAssetControlQstn/rocAssetControlQstn.module";
import { RocDataPartOneModule } from "./modules/part-I-assessment-overview/roc-data-part-one.module";
import { AppendixModule } from "./modules/appendix/appendix.module";
import { GenerateRocModule } from "./modules/generateRoc/generateRoc.module";
import { SanitizeMiddleware } from "./core/guards/sanitize.middleware";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    ProjectModule,
    ClientModule,
    NotificationModule,
    QuestionnaireModule,
    LookupModule,
    SystemTemplateModule,
    AssessmentTaskModule,
    S3Module,
    RocAssetControlModule,
    RocControlFindingModule,
    RocAssetControlQstnModule,
    RocDataPartOneModule,
    AppendixModule,
    GenerateRocModule
  ],
})
export class AppModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestContextMiddleware, AuthContextMiddleware,SanitizeMiddleware)
      .forRoutes('*');  // Apply to all routes
  }
}
 