import { Module } from '@nestjs/common';
import { AppendixModule } from '../appendix/appendix.module';
import { AuthModule } from '../authentication/AuthModule';
import { UserModule } from '../user/user.module';
import { RocDataPartOneModule } from '../part-I-assessment-overview/roc-data-part-one.module';
import { RocControlFindingModule } from '../RocControlFinding/rocControlFinding.module';
import { GenerateRocController } from './controllers/generateRoc.controller';
import { GenerateRocService } from './service/generateRoc.service';
import { RocDataFetcher } from './service/rocDataFetcher';
import { TemplateContextBuilder } from './service/templateContextBuilder';
import { WordDocumentRenderer } from './service/wordDocumentRenderer';

@Module({
  imports: [
    RocDataPartOneModule,
    RocControlFindingModule,
    AppendixModule,
    AuthModule,
    UserModule,
  ],
  controllers: [GenerateRocController],
  providers: [GenerateRocService, RocDataFetcher, TemplateContextBuilder, WordDocumentRenderer],
  exports: [GenerateRocService],
})
export class GenerateRocModule {}
