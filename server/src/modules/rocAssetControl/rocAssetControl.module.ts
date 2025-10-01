import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DATABASE_CONSTANTS } from "src/core/database/constant";
import { RocAssetControlService } from "./service/rocAssetControl.service";
import { RocAssetControlDAO } from "./dao/rocAssetControl.DAO";
import { RocAssetControl, RocAssetControlSchema } from "./model/rocAssetControl.model";
import { RocAssetControlController } from "./controllers/rocAssetControl.controller";
import { AssessmentTaskService } from "../assessmentTask/service/assessmentTask.service";
import { AssessmentTaskModule } from "../assessmentTask/assessmentTask.module";
import { HttpModule } from "@nestjs/axios";
import { QuestionnaireModule } from "../questionaire/questionnaire.module";
import { RocAssetControlQstnModule } from "../rocAssetControlQstn/rocAssetControlQstn.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: RocAssetControl.name, schema: RocAssetControlSchema }]),
    HttpModule,
    forwardRef(() => AssessmentTaskModule),
    QuestionnaireModule,
    RocAssetControlQstnModule
  ],
  controllers: [RocAssetControlController],
  providers: [
    {
    provide: DATABASE_CONSTANTS.RocAssetControl_DAO,
    useClass: RocAssetControlDAO,
    },
    RocAssetControlService
    
  ],
  exports: [RocAssetControlService],
})
export class RocAssetControlModule {}
