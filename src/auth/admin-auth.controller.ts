import { Body, Controller, Post } from "@nestjs/common";
import { AdminAuthService } from "./admin-auth.service";

@Controller("admin-auth")
export class AdminAuthController {
    constructor(private readonly adminAuthService: AdminAuthService) { }

    @Post("signin")
    async signin(@Body() body: { email: string; password: string }) {
        return this.adminAuthService.signin(body.email, body.password);
    }
}
