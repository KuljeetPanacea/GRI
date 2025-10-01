// core/contexts/tenant.context.ts
import { AsyncLocalStorage } from 'async_hooks';

export class TenantContext {
  private static instance: TenantContext;
  private storage: AsyncLocalStorage<string>;

  private constructor() {
    this.storage = new AsyncLocalStorage<string>();
  }

  static getInstance(): TenantContext {
    if (!TenantContext.instance) {
      TenantContext.instance = new TenantContext();
    }
    return TenantContext.instance;
  }

  getTenantId(): string | undefined {
    return this.storage.getStore();
  }

  async run(tenantId: string, fn: () => Promise<any>): Promise<any> {
    return this.storage.run(tenantId, fn);
  }
}