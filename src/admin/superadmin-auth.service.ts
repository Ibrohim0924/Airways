import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Admin } from "./entities/admin.entity";
import { Role } from "src/common/roles.enum";
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class SuperAdminAuthService {
    constructor(
        @InjectRepository(Admin)
        private readonly adminRepo: Repository<Admin>,
        private readonly jwtService: JwtService
    ) { }

    async signin(email: string, password: string) {
        const admin = await this.adminRepo.findOne({ where: { email, role: Role.SUPER_ADMIN } });
        if (!admin) {
            throw new UnauthorizedException('SuperAdmin topilmadi');
        }

        const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
        if (!isPasswordValid) {
            throw new UnauthorizedException("Parol noto'g'ri");
        }
        const payload = { sub: admin.id, role: admin.role };

        return {
            access_token: this.jwtService.sign(payload, {
                secret: process.env.JWT_SUPERADMIN_SECRET,
                expiresIn: process.env.JWT_SUPERADMIN_EXPIRATION || '30d'
            }),
            admin: {
                id: admin.id,
                email: admin.email,
                role: admin.role
            }
        };
    }
}