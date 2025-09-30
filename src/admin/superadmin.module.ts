import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Admin } from "./entities/admin.entity";
import { JwtModule } from "@nestjs/jwt";
import { SuperAdminController } from "./superadmin.controller";
import { SuperAdminAuthService } from "./superadmin-auth.service";
import { CreateSuperAdmin } from "src/utils/createsuperadmin";
import * as dotenv from 'dotenv';
import { SuperAdminGuard } from "src/auth/guards/superadmin.guard";

dotenv.config();

@Module({
    imports: [
        TypeOrmModule.forFeature([Admin]),
        JwtModule.register({
            secret: process.env.JWT_SUPERADMIN_SECRET,
            signOptions: { expiresIn: process.env.JWT_SUPERADMIN_EXPIRATION || '365d' }
        })
    ],
    controllers: [SuperAdminController],
    providers: [SuperAdminAuthService, SuperAdminGuard, CreateSuperAdmin],
    exports: [SuperAdminGuard]
})
export class SuperAdminAuthModule {}