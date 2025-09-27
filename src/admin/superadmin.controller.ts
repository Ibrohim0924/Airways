import { Body, Controller, Post } from "@nestjs/common";
import { SuperAdminAuthService } from "./superadmin-auth.service";

@Controller('superadmin-auth')
export class SuperAdminController {
    constructor(
        private readonly superAdminAuthService: SuperAdminAuthService
    ) {}

    @Post('signin')
    async signin(@Body() dto: {email: string; password: string}){
        return this.superAdminAuthService.signin(dto.email, dto.password)
    }
}