import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from '../guard/local_auth.guard';
import { AuthService } from '../service/auth.service';
import { JWTResponseModel } from '../model/jwt_response.model';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@Request() req): Promise<JWTResponseModel> {
        return this.authService.generateToken(req.user);
    }
}
