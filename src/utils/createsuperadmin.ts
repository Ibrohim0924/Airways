import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Admin } from "../admin/entities/admin.entity";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt'
import * as dotenv from 'dotenv'
import { Role } from "../common/roles.enum";
dotenv.config()

@Injectable()
export class CreateSuperAdmin implements OnModuleInit {
    constructor(
        @InjectRepository(Admin) private readonly superAdminRepo: Repository<Admin>
    ) { }

    async onModuleInit() {
        const superEmail = process.env.SUPERADMIN_EMAIL;
        const exists = await this.superAdminRepo.findOne({ where: { email: superEmail } });

        if (!exists) {
            const hash = await bcrypt.hash(process.env.SUPERADMIN_PASSWORD, 10);
            const superadmin = this.superAdminRepo.create({
                username: process.env.SUPERADMIN_NAME,
                email: superEmail,
                passwordHash: hash,
                role: Role.SUPER_ADMIN
            });
            await this.superAdminRepo.save(superadmin);
            console.log('✅ SuperAdmin yaratildi!');
        } else {
            console.log('ℹ️ SuperAdmin allaqachon mavjud:', exists.email);
        }
    }
}
