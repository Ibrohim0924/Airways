import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Admin } from "src/admin/entities/admin.entity";
import { AdminAuthService } from "./admin-auth.service";
import { AdminAuthController } from "./admin-auth.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Admin]), JwtModule.register({})],
    providers: [AdminAuthService],
    controllers: [AdminAuthController]
})

export class AdminAuthModule { }