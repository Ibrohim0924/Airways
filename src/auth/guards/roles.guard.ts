import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core/services/reflector.service";
import { ROLES_KEY } from "src/decorators/roles.decorator";


@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();
        if (!user) {
            throw new ForbiddenException('Foydalanuvchi topilmadi');
        }

        const hashRole = requiredRoles.includes(user.role);
        if (!hashRole) {
            throw new ForbiddenException('Sizda bunday huquq yo‘q');
        }
        return true
    }
}