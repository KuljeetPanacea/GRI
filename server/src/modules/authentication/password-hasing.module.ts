import { Module } from "@nestjs/common";
import { PasswordHashingService } from "./services/password-hasing.service";

@Module({
  providers: [PasswordHashingService],
  exports: [PasswordHashingService], // Export to use in other modules
})
export class PasswordHashingModule {}
