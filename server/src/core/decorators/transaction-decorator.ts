import { Connection, ClientSession } from "mongoose";
import { TransactionContext } from "../database/transaction-context";

export function Transactional() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const txContext = TransactionContext.getInstance();
      const existingSession = txContext.getSession();

      // If already in a transaction, reuse it
      if (existingSession) {
        return await originalMethod.apply(this, args);
      }

      // Start new transaction
      const connection: Connection = this.connection;
      const session: ClientSession = await connection.startSession();
      session.startTransaction();

      try {
        const result = await txContext.run(session, () => {
          return originalMethod.apply(this, args);
        });
        await session.commitTransaction();
        return result;
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        await session.endSession();
      }
    };

    return descriptor;
  };
}
