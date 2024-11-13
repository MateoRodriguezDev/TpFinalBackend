import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from "@nestjs/common";
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthRolGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector, // Reflector se usa para obtener metadata del decorador
    ){}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user; // Usuario ya almacenado en el request

        if (!user) {
            throw new ForbiddenException('User Not Authenticated');
        }

        // Obtener los roles requeridos desde la metadata de la ruta
        const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!requiredRoles || requiredRoles.length === 0) {
            return true; // Si no hay roles requeridos, permitir acceso
        }

        // Verificar si el usuario tiene uno de los roles requeridos
        const userRoles = user.role || []; // Asume que el usuario tiene una propiedad "role"
        const hasRole = requiredRoles.some(role => userRoles.includes(role));

        if (!hasRole) {
            throw new ForbiddenException('You cannot access this route');
        }

        return true;
    }
}