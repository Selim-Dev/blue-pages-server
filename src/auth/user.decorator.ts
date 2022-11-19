import { createParamDecorator, ExecutionContext } from '@nestjs/common';

//used createParamDecorator to create a decorator that will be used to get the user from the request
export const UserDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);