import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Questionnaire, QuestionnaireSchema } from './model/questionnaire.model';
import { QuestionnaireDao } from './Dao/questionnaire.dao';
import { QuestionnaireService } from './services/questionnaire.service';
import { QuestionnaireController } from './controller/questionnaire.controller';
import { AssessmentTaskModule } from '../assessmentTask/assessmentTask.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Questionnaire.name, schema: QuestionnaireSchema }])
  ],
  controllers: [QuestionnaireController],
  providers: [QuestionnaireService, QuestionnaireDao],
  exports: [QuestionnaireService, QuestionnaireDao],
})
export class QuestionnaireModule {}

