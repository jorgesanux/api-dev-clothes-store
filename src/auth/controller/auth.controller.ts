import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { LocalAuthGuard } from '../guard/local_auth.guard';
import { AuthService } from '../service/auth.service';
import { JWTResponseModel } from '../model/jwt_response.model';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../decorator/public.decorator';
import { SignupDTO } from '../dto/signup.dto';
import { ApiResponse } from '../../common/interface/api_response.interface';
import { Customer } from '../../user/entity/customer.entity';
import { EmailService } from '../../email/service/email.service';
import { User } from '../../user/entity/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private emailService: EmailService,
    ) {}
    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@Req() req: Request): Promise<JWTResponseModel> {
        const user = req.user as User;
        const authInfo: JWTResponseModel = this.authService.generateToken(user);
        this.emailService
            .sendEmail({
                to: user.email,
                subject: 'New login detected on your account',
                text: `Hi ${
                    user.email
                }, we are detected a login in your account. When: ${new Date().toLocaleString()}. IP: ${
                    req.ip
                }`,
            })
            .then(() => {});
        return authInfo;
    }
    @Public()
    @HttpCode(HttpStatus.CREATED)
    @Post('/signup')
    async signup(@Body() body: SignupDTO): Promise<ApiResponse<Customer>> {
        const customer: Customer =
            await this.authService.registerUserAndCustomer(body);
        const response: ApiResponse<Customer> = {
            statusCode: HttpStatus.CREATED,
            message: 'Created',
            result: customer,
        };
        this.emailService
            .sendEmail({
                to: customer.email,
                subject: `Successfully registered`,
                text: `Hi ${customer.fullName}. You have successfully registered on Clothes Store.`,
            })
            .then(() => {});
        return response;
    }
}
