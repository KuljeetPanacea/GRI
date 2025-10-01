import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UserDAO } from "../user/dao/User.dao";
import { RoleDAO } from "../../core/dao/role.dao";
import { AuthService } from "./services/auth.service";
import { RoleService } from "../../core/service/role.service";
import { JwtAuthGuard } from "../../core/guards/jwt-auth.guard";
import { PermissionsGuard } from "../../core/guards/permissions.guards";
import { authConfig } from "./config/authConfig";
import { DATABASE_CONSTANTS } from "../../core/database/constant";
import { PasswordHashingModule } from "./password-hasing.module";
import { DatabaseModule } from "src/core/database/database.module";
import { AuthController } from "./controller/auth.controller";
import { TenantDAO } from "./dao/tenant.dao";
import { UserService } from "../user/services/user.service";
import { OtpService } from "../otp/service/otp.service";
import { UserContextService } from "src/core/service/user-context.service";
import { OutboxModule } from "src/core/outbox/outbox.module";
import { EmailService } from "../email/mail.service";
import { SystemTemplateModule } from "../systemtemplate/systemTemplate.module";
import { UserModule } from "../user/user.module";
import { forwardRef } from "@nestjs/common";

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: authConfig.JWT_SECRET,
      signOptions: { expiresIn: authConfig.JWT_EXPIRES_IN },
    }),
    DatabaseModule,
    PasswordHashingModule,
    OutboxModule,
    SystemTemplateModule,
    forwardRef(() => UserModule),
    
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    RoleService,
    JwtAuthGuard,
    PermissionsGuard,
    UserService,
    OtpService,
    EmailService,
    UserContextService,
    EmailService,
    {
      provide: DATABASE_CONSTANTS.USER_DAO,
      useClass: UserDAO,
    },
    {
      provide: DATABASE_CONSTANTS.ROLE_DAO,
      useClass: RoleDAO,
    },
    {
      provide: DATABASE_CONSTANTS.TENANT_DAO,
      useClass: TenantDAO,
    },
  ],
  exports: [
    AuthService,
    RoleService,
    JwtAuthGuard,
    PermissionsGuard,
    JwtModule,
    UserContextService,
    EmailService
  ],
})
export class AuthModule {}
