import {
    Body, ConflictException,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query, UnprocessableEntityException
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { CreateUserDTO, UpdateUserDTO } from 'src/user/dto/user.dto';
import { User } from 'src/user/entity/user.entity';
import { ApiResponse } from 'src/common/interface/api_response.interface';
import { UserService } from 'src/user/service/user.service';
import { QueryFailedError } from "typeorm";

@ApiTags("User")
@Controller('user')
export class UserController {
    constructor(
        private userService: UserService,
    ) {}

    @Get('/')
    @HttpCode(HttpStatus.OK)
    async getAll(@Query('limit') limit = 10): Promise<ApiResponse<User>> {
        const response: ApiResponse<User> = {
            statusCode: HttpStatus.OK,
            message: 'OK',
            results: await this.userService.findAll(),
        };
        return response;
    }

    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    async getById(@Param('id', ParseIntPipe) id: number): Promise<ApiResponse<User>> {
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
    async delete(@Param('id', ParseIntPipe) id: number): Promise<ApiResponse<User>> {
        const response: ApiResponse<User> = {
            message: 'Deleted',
            statusCode: HttpStatus.OK,
            result: await this.userService.delete(id),
        };
        return response;
    }
}
