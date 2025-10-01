import { SetMetadata } from '@nestjs/common';
export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...permissions: string[]) => 
  SetMetadata(PERMISSIONS_KEY, permissions);

import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserContext } from '../contexts/user.context';


@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get required permissions from decorator
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()]
    );
    
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true; // No permissions required
    }

    const userContext = UserContext.getInstance();
    
    // Check if user has all required permissions
    const hasAllRequiredPermissions = requiredPermissions.every(
      permission => userContext.hasPermission(permission)
    );
    
    if (!hasAllRequiredPermissions) {
      throw new ForbiddenException('Insufficient permissions');
    }
    
    return true;
  }
}