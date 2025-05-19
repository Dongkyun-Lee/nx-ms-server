import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES } from '../constants';
import { ROLES_KEY } from '../decorator/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) return true;
    // ANONYMOUS 대상이면 모두 접근 가능
    if (requiredRoles.includes(ROLES.ANONYMOUS)) return true;

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.roles) return false;

    // 관리자 모든 기능 접근 가능
    if (user.roles.includes(ROLES.ADMIN)) return true;

    return requiredRoles.some((requied) => user.roles.includes(requied));
  }
}
