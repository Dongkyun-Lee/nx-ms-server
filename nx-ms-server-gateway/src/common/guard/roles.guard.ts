import { CanActivate, ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', ctx.getHandler());
    if (!roles) return true;

    const { user } = ctx.switchToHttp().getRequest();
    return roles.includes(user.role);
  }
}

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
