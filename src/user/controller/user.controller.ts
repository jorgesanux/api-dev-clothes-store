import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseUUIDPipe,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

import {
    CreateUserDTO,
    QueryUserDTO,
    UpdateUserDTO,
} from 'src/user/dto/user.dto';
import { User } from 'src/user/entity/user.entity';
import { ApiResponse } from 'src/common/interface/api_response.interface';
import { UserService } from 'src/user/service/user.service';
import { Roles } from '../../auth/decorator/roles.decorator';
import { Role } from '../../auth/model/role.model';

@ApiTags('User')
@Controller('user')
@Roles([Role.ADMIN])
export class UserController {
    constructor(private userService: UserService) {}

    @ApiQuery({ name: 'limit', type: 'number', required: false })
    @ApiQuery({ name: 'page', type: 'number', required: false })
    @ApiQuery({ name: 'email', type: 'email', required: false })
    @ApiQuery({ name: 'role', type: 'string', required: false })
    @ApiQuery({ name: 'createdAtInit', type: 'datetime', required: false })
    @ApiQuery({ name: 'createdAtEnd', type: 'datetime', required: false })
    @ApiQuery({ name: 'updatedAtInit', type: 'datetime', required: false })
    @ApiQuery({ name: 'updatedAtEnd', type: 'datetime', required: false })
    @Get('/')
    @HttpCode(HttpStatus.OK)
    async getAll(
        @Query() queryParams: QueryUserDTO,
    ): Promise<ApiResponse<User>> {
        const [users, count] = await this.userService.findAll(queryParams);

        const response: ApiResponse<User> = {
            statusCode: HttpStatus.OK,
            message: 'OK',
            results: users,
            count,
        };
        return response;
    }

    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    async getById(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<ApiResponse<User>> {
        const response: ApiResponse<User> = {
            message: 'OK',
            statusCode: HttpStatus.OK,
            result: await this.userService.findOne(id),
        };
        return response;
    }

    @Post('/')
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() body: CreateUserDTO): Promise<ApiResponse<User>> {
        const response: ApiResponse<User> = {
            message: 'Created',
            statusCode: HttpStatus.CREATED,
            result: await this.userService.create(body),
        };
        return response;
    }

    @Put('/:id')
    @HttpCode(HttpStatus.OK)
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() body: UpdateUserDTO,
    ): Promise<ApiResponse<User>> {
        const response: ApiResponse<User> = {
            message: 'Updated',
            statusCode: HttpStatus.OK,
            result: await this.userService.update(id, body),
        };
        return response;
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.OK)
    async delete(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<ApiResponse<User>> {
        const response: ApiResponse<User> = {
            message: 'Deleted',
            statusCode: HttpStatus.OK,
            result: await this.userService.delete(id),
        };
        return response;
    }
}
