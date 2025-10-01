import { Module } from "@nestjs/common";
import { Project, ProjectSchema } from "./model/project.model";
import { MongooseModule } from "@nestjs/mongoose";
import { ProjectService } from "./service/project.service";
import { AuthModule } from "../authentication/AuthModule";
import { ProjectController } from "./controllers/project.controller";
import { RoleService } from "src/core/service/role.service";
import { DATABASE_CONSTANTS } from "src/core/database/constant";
import { ProjectDAO } from "./dao/Project.dao";
import { RoleDAO } from "src/core/dao/role.dao";
import { ClientModule } from "../client/client.module";
import { UserModule } from "../user/user.module";
import { PasswordHashingService } from "../authentication/services/password-hasing.service";
import { QuestionnaireModule } from "../questionaire/questionnaire.module";
import { OutboxModule } from "src/core/outbox";
import { S3Module } from "../s3/s3.module";
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
    AuthModule,
    ClientModule,
    UserModule,
    QuestionnaireModule,
    OutboxModule,
    S3Module,
    HttpModule
  ],
  controllers: [ProjectController],
  providers: [
    {
      provide: DATABASE_CONSTANTS.PROJECT_DAO,
      useClass: ProjectDAO,
    },
    {
      provide: DATABASE_CONSTANTS.ROLE_DAO,
      useClass: RoleDAO,
    },
    ProjectService,
    RoleService,
    PasswordHashingService
  ],
  exports: [ProjectService],
})
export class ProjectModule {}
