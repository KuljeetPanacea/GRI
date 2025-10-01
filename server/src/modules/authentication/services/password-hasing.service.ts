import { Injectable } from "@nestjs/common";
import bcrypt from "bcryptjs";
import { authConfig } from "src/modules/authentication/config/authConfig";

@Injectable()
export class PasswordHashingService {
  async hashPassword(password: string): Promise<string> {
    if (!authConfig.saltRounds || typeof authConfig.saltRounds !== "number") {
      throw new Error("Invalid saltRounds value in authConfig");
    }
    return bcrypt.hash(password, authConfig.saltRounds);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
