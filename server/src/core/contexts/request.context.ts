// core/contexts/request.context.ts
import { AsyncLocalStorage } from 'async_hooks';

export interface RequestContextData {
  requestId: string;
  url?: string;
  method?: string;
  startTime: number;
  ip?: string;
  userAgent?: string;
}

export class RequestContext {
  private static instance: RequestContext;
  private storage: AsyncLocalStorage<RequestContextData>;

  private constructor() {
    this.storage = new AsyncLocalStorage<RequestContextData>();
  }

  static getInstance(): RequestContext {
    if (!RequestContext.instance) {
      RequestContext.instance = new RequestContext();
    }
    return RequestContext.instance;
  }

  getRequestId(): string | undefined {
    return this.storage.getStore()?.requestId;
  }

  getRequestData(): RequestContextData | undefined {
    return this.storage.getStore();
  }

  async run(requestData: RequestContextData, fn: () => Promise<any>): Promise<any> {
    return this.storage.run(requestData, fn);
  }
}