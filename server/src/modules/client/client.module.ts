import { Module } from "@nestjs/common";
import { Client, ClientSchema } from "./models/client.model";
import { MongooseModule } from "@nestjs/mongoose";
import { ClientService } from "./services/client.service";
import { AuthModule } from "../authentication/AuthModule";
import { RoleService } from "src/core/service/role.service";
import { DATABASE_CONSTANTS } from "src/core/database/constant";
import { RoleDAO } from "src/core/dao/role.dao";
import { ClientController } from "./controllers/client.controller";
import { ClientDAO } from "./dao/Client.dao";
import { UserModule } from "../user/user.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Client.name, schema: ClientSchema }]),
    AuthModule,
    UserModule,
  ],
  controllers: [ClientController],
  providers: [
    {
      provide: DATABASE_CONSTANTS.CLIENT_DAO,
      useClass: ClientDAO,
    },
    {
      provide: DATABASE_CONSTANTS.ROLE_DAO,
      useClass: RoleDAO,
    },
    ClientService,
    RoleService
  ],
  exports: [ClientService],
})
export class ClientModule {}
