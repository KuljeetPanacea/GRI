// core/auth/guards/jwt-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { UserContext } from '../contexts/user.context';


@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // Check if user context is set
    if (!UserContext.getInstance().getUserId()) {
      throw new UnauthorizedException('Authentication required');
    }
    
    // User is authenticated
    return true;
  }
}