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
import { CreateUserDTO, UpdateUserDTO } from 'src/dto/user.dto';
import { User } from 'src/entity/user.entity';
import { ApiResponse } from 'src/interface/api-response.interface';
import { UserService } from 'src/service/user.service';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('/')
    @HttpCode(HttpStatus.OK)
    getAll(@Query('limit') limit = 10): ApiResponse<User> {
        const response: ApiResponse<User> = {
            statusCode: HttpStatus.OK,
            message: 'OK',
            results: this.userService.findAll(),
        };
        return response;
    }

    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    getById(@Param('id', ParseIntPipe) id: number): ApiResponse<User> {
        const response: ApiResponse<User> = {
            message: 'OK',
            statusCode: HttpStatus.OK,
            result: this.userService.findOne(id),
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
