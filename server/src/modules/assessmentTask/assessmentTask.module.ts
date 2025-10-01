import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DATABASE_CONSTANTS } from "src/core/database/constant";
import { QuestionnaireModule } from "../questionaire/questionnaire.module";
import { ProjectModule } from "../project/project.module";
import { AssessmentTask, AssessmentTaskSchema } from "./model/assessmentTask.model";
import { AssessmentTaskController } from "./controllers/assessmentTask.controller";
import { AssessmentTaskDAO } from "./dao/assessmentTask.dao";
import { AssessmentTaskService } from "./service/assessmentTask.service";
import { RocAssetControlModule } from "../rocAssetControl/rocAssetControl.module";
import { RocAssetControlQstnModule } from "../rocAssetControlQstn/rocAssetControlQstn.module";
import { UserModule } from "../user/user.module";
import { OutboxModule } from "src/core/outbox/outbox.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AssessmentTask.name, schema: AssessmentTaskSchema }]),
    QuestionnaireModule,
    ProjectModule,
     forwardRef(() => RocAssetControlModule),
    RocAssetControlQstnModule,
    UserModule,
    OutboxModule
  ],
  controllers: [AssessmentTaskController],
  providers: [
    {
    provide: DATABASE_CONSTANTS.AUDIT_DAO,
    useClass: AssessmentTaskDAO,
    },
    AssessmentTaskService,
  ],
  exports: [AssessmentTaskService,DATABASE_CONSTANTS.AUDIT_DAO],
})
export class AssessmentTaskModule {}
