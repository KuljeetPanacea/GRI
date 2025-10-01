// core/contexts/user.context.ts
import { AsyncLocalStorage } from 'async_hooks';

interface UserContextData {
  userId: string;
  roles: string[];
  permissions: string[];
  isProductAdmin: boolean;
}

export class UserContext {
  private static instance: UserContext;
  private storage: AsyncLocalStorage<UserContextData>;

  private constructor() {
    this.storage = new AsyncLocalStorage<UserContextData>();
  }

  static getInstance(): UserContext {
    if (!UserContext.instance) {
      UserContext.instance = new UserContext();
    }
    return UserContext.instance;
  }

  getUserId(): string | undefined {
    return this.storage.getStore()?.userId;
  }

  getRoles(): string[] {
    return this.storage.getStore()?.roles || [];
  }

  getPermissions(): string[] {
    return this.storage.getStore()?.permissions || [];
  }

  isProductAdmin(): boolean {
    return this.storage.getStore()?.isProductAdmin || false;
  }

  hasPermission(permission: string): boolean {
    const permissions = this.getPermissions();
    return permissions.includes(permission) || permissions.includes('*');
  }

  async run(userData: UserContextData, fn: () => Promise<any>): Promise<any> {
    return this.storage.run(userData, fn);
  }
}