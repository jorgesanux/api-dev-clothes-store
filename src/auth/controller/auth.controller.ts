import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Request,
    UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from '../guard/local_auth.guard';
import { AuthService } from '../service/auth.service';
import { JWTResponseModel } from '../model/jwt_response.model';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../decorator/public.decorator';
import { SignupDTO } from '../dto/signup.dto';
import { ApiResponse } from '../../common/interface/api_response.interface';
import { Customer } from '../../user/entity/customer.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@Request() req): Promise<JWTResponseModel> {
        return this.authService.generateToken(req.user);
    }
    @Public()
    @HttpCode(HttpStatus.CREATED)
    @Post('/signup')
    async signup(@Body() body: SignupDTO): Promise<ApiResponse<Customer>> {
        const response: ApiResponse<Customer> = {
            statusCode: HttpStatus.CREATED,
            message: 'Created',
            result: await this.authService.registerUserAndCustomer(body),
        };
        return response;
    }
}
