import { SetMetadata } from '@nestjs/common';

export const RolesMeta = (...roles: string[]) => SetMetadata('roles', roles);