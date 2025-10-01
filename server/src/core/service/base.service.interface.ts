import { ClientSession } from "mongoose";

// BaseServiceInterface Interface to enforce a consistent contract for all services
export interface BaseServiceInterface {
  runInTransaction<T>(
    operation: (session: ClientSession) => Promise<T>
  ): Promise<T>;
}
