import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Role } from 'src/common/roles.enum';
import * as dotenv from 'dotenv'
dotenv.config()

@Injectable()
export class SuperAdminGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) { }

    canActivate(context: ExecutionContext): boolean {
        const request: Request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'];

        if (!authHeader) throw new UnauthorizedException('Token yo‘q');

        const token = authHeader.replace('Bearer ', '');
        try {
            const payload = this.jwtService.verify(token, {
                secret: process.env.JWT_SUPERADMIN_SECRET,
            });


            if (payload.role !== Role.SUPER_ADMIN) {
                throw new UnauthorizedException('Faqat SuperAdmin ruxsat etiladi');
            }

            request['user'] = payload;
            return true;
        } catch (err) {
            throw new UnauthorizedException('Token noto‘g‘ri yoki eskirgan');
        }
    }
}
