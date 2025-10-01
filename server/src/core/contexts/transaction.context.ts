// core/contexts/transaction.context.ts
import { AsyncLocalStorage } from 'async_hooks';
import { ClientSession } from 'mongoose';

export class TransactionContext {
  private static instance: TransactionContext;
  private storage: AsyncLocalStorage<ClientSession>;

  private constructor() {
    this.storage = new AsyncLocalStorage<ClientSession>();
  }

  static getInstance(): TransactionContext {
    if (!TransactionContext.instance) {
      TransactionContext.instance = new TransactionContext();
    }
    return TransactionContext.instance;
  }

  getSession(): ClientSession | undefined {
    return this.storage.getStore();
  }

  async run(session: ClientSession, fn: () => Promise<any>): Promise<any> {
    return this.storage.run(session, fn);
  }
}