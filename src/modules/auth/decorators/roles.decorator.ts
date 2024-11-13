import { SetMetadata } from '@nestjs/common';

// Este decorador establece los roles requeridos como metadata
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);