import { Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { LocalAuthGuard } from '../guard/local_auth.guard';
import { AuthService } from '../service/auth.service';
import { JWTResponseModel } from '../model/jwt_response.model';
import { JwtAuthGuard } from "../guard/jwt_auth.guard";
import { User } from "../../user/entity/user.entity";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@Request() req): Promise<JWTResponseModel> {
        return this.authService.generateToken(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/profile')
    async getProfile(@Request() req): Promise<User>{
        return req.user;
    }
}
