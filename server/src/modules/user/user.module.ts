import { Module } from "@nestjs/common";
import { UsersController } from "./controllers/users.controller";
import { User, UserSchema } from "./models/user.model";
import { MongooseModule } from "@nestjs/mongoose";
import { DATABASE_CONSTANTS } from "../../core/database/constant";
import { UserService } from "./services/user.service";
import { UserDAO } from "./dao/User.dao";
import { PasswordHashingService } from "../authentication/services/password-hasing.service";
import { RoleService } from "src/core/service/role.service";
import { RoleDAO } from "src/core/dao/role.dao";
import { AuthModule } from "../authentication/AuthModule";
import { OutboxService } from "src/core/outbox/services/outbox.service";
import { OutboxMessageDAO } from "src/core/outbox/daos/outbox-message.dao";
import { OutboxModule } from "src/core/outbox/outbox.module";
import { ProjectDAO } from "../project/dao/Project.dao";
import { Project, ProjectSchema } from "../project/model/project.model";
import { forwardRef } from "@nestjs/common";
      

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Project.name, schema: ProjectSchema }, 

    ]),
    forwardRef(() => AuthModule),
    OutboxModule
  ],
  controllers: [UsersController],
  providers: [
    UserService,
    {
      provide: DATABASE_CONSTANTS.USER_DAO,
      useClass: UserDAO,
    },
    {
      provide: DATABASE_CONSTANTS.ROLE_DAO,
      useClass: RoleDAO,
    },
    {
      provide: DATABASE_CONSTANTS.PROJECT_DAO,
      useClass: ProjectDAO,
    },
    PasswordHashingService,
    RoleService,
    OutboxService,
    
  ],
  exports: [
    UserService,
    {
      provide: DATABASE_CONSTANTS.PROJECT_DAO,
      useClass: ProjectDAO,
    }

  ],
})
export class UserModule {}
