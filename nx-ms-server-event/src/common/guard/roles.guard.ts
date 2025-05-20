import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { HEADER_ROLES_KEY, ROLES_KEY } from '../constant';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      ROLES_KEY,
      context.getHandler(),
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const rolesHeader: string = request.headers[HEADER_ROLES_KEY];

    if (!rolesHeader) {
      throw new ForbiddenException('Can not find authroization information');
    }

    const userRoles = rolesHeader.split(',').map((r) => r.trim());

    const hasRole = requiredRoles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      throw new ForbiddenException('Unauthorized');
    }

    return true;
  }
}
