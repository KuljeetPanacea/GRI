import { Module, Global } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { User, UserSchema } from "src/modules/user/models/user.model";
import { Role, RoleSchema } from "src/core/model/role.model";
import { Tenant } from "src/modules/authentication/model/tenant.models";
import { TenantSchema } from "src/modules/authentication/model/tenant.models";

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("MONGO_URL"),
        
        // Connection options are now directly in the root object
        minPoolSize: 5,
        maxPoolSize: 20,
        serverSelectionTimeoutMS: 5000,
        // Optional: Add connection hooks
        connectionFactory: (connection) => {
          connection.on("connected", () => {
            console.log("✅ MongoDB Connected");
          });
          connection.on("error", (error) => {
            console.error("❌ MongoDB Connection Error:", error);
          });
          return connection;
        },
      }),
    }),
    
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
      { name: Tenant.name, schema: TenantSchema },
    ]),
  ],
  exports: [MongooseModule],
  
})
export class DatabaseModule {}
