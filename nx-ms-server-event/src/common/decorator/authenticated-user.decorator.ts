import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthenticatedUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = {
      id: request?.headers['ms-user-id'] || null,
      email: request?.headers['ms-user-email'] || null,
      nickname: request?.headers['ms-user-nickname'] || null,
      role: request?.headers['ms-user-roles']?.split(','),
    };

    return user.id ? user : null;
  },
);
