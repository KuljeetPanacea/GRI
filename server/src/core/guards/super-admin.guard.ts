import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UserContext } from '../contexts/user.context';


@Injectable()
export class SuperAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    if (!UserContext.getInstance().isProductAdmin()) {
      throw new ForbiddenException('Super admin access required');
    }
    
    return true;
  }
}