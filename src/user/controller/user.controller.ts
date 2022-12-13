import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

import { CreateUserDTO, UpdateUserDTO } from 'src/user/dto/user.dto';
import { User } from 'src/user/entity/user.entity';
import { ApiResponse } from 'src/common/interface/api_response.interface';
import { UserService } from 'src/user/service/user.service';
import { Constant } from '../../common/constant';

@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @ApiQuery({ name: 'limit', type: 'number', required: false })
    @ApiQuery({ name: 'page', type: 'number', required: false })
    @Get('/')
    @HttpCode(HttpStatus.OK)
    async getAll(
        @Query('limit') limit = Constant.controllerParams.LIMIT,
        @Query('page') page = Constant.controllerParams.PAGE,
    ): Promise<ApiResponse<User>> {
        if (limit <= 0) limit = Constant.controllerParams.LIMIT;
        if (page <= 0) page = Constant.controllerParams.PAGE;

        const [users, count] = await this.userService.findAll(limit, page);

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
        @Param('id', ParseIntPipe) id: number,
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
        @Param('id', ParseIntPipe) id: number,
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
        @Param('id', ParseIntPipe) id: number,
    ): Promise<ApiResponse<User>> {
        const response: ApiResponse<User> = {
            message: 'Deleted',
            statusCode: HttpStatus.OK,
            result: await this.userService.delete(id),
        };
        return response;
    }
}
