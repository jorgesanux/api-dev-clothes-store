import { Controller, Get, HttpCode, HttpStatus, Request } from '@nestjs/common';
import { User } from '../entity/user.entity';
import { Order } from '../../order/entity/order.entity';
import { Roles } from '../../auth/decorator/roles.decorator';
import { Role } from '../../auth/model/role.model';
import { ApiResponse } from '../../common/interface/api_response.interface';
import { ProfileService } from '../service/profile.service';

@Controller('profile')
export class ProfileController {
    constructor(private profileService: ProfileService) {}
    @Get('/')
    @HttpCode(HttpStatus.OK)
    async getProfile(@Request() req): Promise<User> {
        return req.user;
    }

    @Roles([Role.CUSTOMER])
    @Get('/my_orders')
    @HttpCode(HttpStatus.OK)
    async getOrdersByCustomer(@Request() req): Promise<ApiResponse<Order>> {
        const user: User = req.user;
        const response: ApiResponse<Order> = {
            statusCode: HttpStatus.OK,
            message: 'OK',
            results: await this.profileService.findOrdersByCustomerWithUserId(
                user.id,
            ),
        };
        return response;
    }
}
