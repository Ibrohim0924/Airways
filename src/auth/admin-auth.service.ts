import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Admin } from "src/admin/entities/admin.entity";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt'


@Injectable()
export class AdminAuthService {
    constructor(
        @InjectRepository(Admin)
        private readonly adminRepository: Repository<Admin>,
        private readonly jwtService: JwtService
    ) { }

    async signin(email: string, password: string) {
        const admin = await this.adminRepository.findOne({
            where: { email }
        })
        if (!admin) {
            throw new NotFoundException('Admin topilmadi')
        }
        console.log('Input password:', password);
        console.log('DB passwordHash:', admin.passwordHash);
        const isPasswordValid = await bcrypt.compare(password, admin.passwordHash)

        if (!isPasswordValid) {
            throw new UnauthorizedException("Email yoki parol noto‘g‘ri")
        }
        const payload = { sub: admin.id, role: admin.role };

        return {
            access_token: this.jwtService.sign(payload, {
                secret: process.env.JWT_ACCESS_TOKEN_SECRET,
                expiresIn: '30d'
            }),
            admin: {
                id: admin.id,
                email: admin.email,
                role: admin.role
            }
        };


    }

}
