import { Connection, ClientSession } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import { BaseServiceInterface } from "./base.service.interface";

@Injectable()
export abstract class BaseService implements BaseServiceInterface {
  constructor(@InjectConnection() protected readonly connection: Connection) {}

  async runInTransaction<T>(
    operation: (session: ClientSession) => Promise<T>
  ): Promise<T> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const result = await operation(session);
      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }
}
