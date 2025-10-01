import { Module } from "@nestjs/common";
import { EmailService } from "./mail.service";

@Module({
  providers: [EmailService],
  exports: [EmailService], // Export MailService for use in other modules
})
export class EmailModule {}
