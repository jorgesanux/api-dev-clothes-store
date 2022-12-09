import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus, Inject,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query
} from "@nestjs/common";
import { Client } from "pg";
import { ApiTags } from "@nestjs/swagger";

import { CreateUserDTO, UpdateUserDTO } from 'src/user/dto/user.dto';
import { User } from 'src/user/entity/user.entity';
import { ApiResponse } from 'src/common/interface/api-response.interface';
import { UserService } from 'src/user/service/user.service';
import { Constant } from "../../common/constant";

@ApiTags("User")
@Controller('user')
export class UserController {
    constructor(
        @Inject(Constant.providerKeys.PG_CLIENT) private client: Client,
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
    create(@Body() body: CreateUserDTO): ApiResponse<User> {
        const response: ApiResponse<User> = {
            message: 'Created',
            statusCode: HttpStatus.CREATED,
            result: this.userService.create(body),
        };
        return response;
    }

    @Put('/:id')
    @HttpCode(HttpStatus.OK)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateUserDTO,
    ): ApiResponse<User> {
        const response: ApiResponse<User> = {
            message: 'Updated',
            statusCode: HttpStatus.OK,
            result: this.userService.update(id, body),
        };
        return response;
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.OK)
    delete(@Param('id', ParseIntPipe) id: number): ApiResponse<User> {
        const response: ApiResponse<User> = {
            message: 'Deleted',
            statusCode: HttpStatus.OK,
            result: this.userService.delete(id),
        };
        return response;
    }
}
