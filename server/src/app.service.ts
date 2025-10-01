import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly configService: ConfigService) {}

  checkHealth(): { status: string; uptime: number } {
    this.logger.log("Health check performed");
    return {
      status: "UP",
      uptime: process.uptime(),
    };
  }
}
