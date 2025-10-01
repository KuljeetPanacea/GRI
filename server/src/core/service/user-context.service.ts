// core/auth/user-context.service.ts
import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class UserContextService {
  private userId: string;
  constructor(@Inject(REQUEST) private readonly request: Request) {
    this.userId = (request as any).user?.sub;
  }

  getUserId(): string {
    const userId = this.userId;
    if (!userId) {
      return 'system'; // Default value when no user context is available
    }
    return userId;
  }
}