// First, create a type definition file (e.g., types/express.d.ts)
import 'express';

// Add user property to Express Request interface
declare module 'express' {
  interface Request {
    user?: any; // You can define a more specific type if you want
  }
}

// Then update the middleware
// core/middleware/auth-context.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { TenantContext } from '../contexts/tenant.context';
import { UserContext } from '../contexts/user.context';
import { RoleService } from '../service/role.service';


@Injectable()
export class AuthContextMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly roleService: RoleService
  ) {}

  async use(req: Request, res: Response, next: Function) {
    try {
      // Extract token from cookie or header
      const token = req.cookies?.Authentication || this.extractTokenFromHeader(req);
      
      if (token) {
        try {
          // Verify the token
          const payload = this.jwtService.verify(token);
          
          // Load permissions for the user's roles
          const permissions = await this.roleService.getPermissionsForRoles(payload.roles || []);
          
          // Check if user is super admin
          const isProductAdmin = payload.roles?.includes('PRODUCT_ADMIN') || false;
          
          // Set up user context
          await UserContext.getInstance().run({
            userId: payload.sub,
            roles: payload.roles || [],
            permissions,
            isProductAdmin: isProductAdmin
          }, async () => {
            // Set up tenant context if tenantId exists
            if (payload.tenantId) {
              await TenantContext.getInstance().run(payload.tenantId, async () => {
                // Now this works correctly since we've extended the Request type
                req.user = {
                  ...payload,
                  permissions
                };
                
                next();
              });
            } else {
              // Still set user context even without tenant
              req.user = {
                ...payload,
                permissions
              };
              
              next();
            }
          });
        } catch (error) {
          // Invalid token, continue without context
          next();
        }
      } else {
        // No token, continue without context
        next();
      }
    } catch (error) {
      // Any other error, continue without context
      console.error('Auth middleware error:', error);
      next();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}