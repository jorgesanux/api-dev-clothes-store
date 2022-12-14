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
    CreateCustomerDTO,
    UpdateCustomerDTO,
} from 'src/user/dto/customer.dto';
import { Customer } from 'src/user/entity/customer.entity';
import { ApiResponse } from 'src/common/interface/api_response.interface';
import { CustomerService } from 'src/user/service/customer.service';
import { Constant } from 'src/common/constant';

@ApiTags('Customer')
@Controller('customer')
export class CustomerController {
    constructor(private customerService: CustomerService) {}

    @ApiQuery({ name: 'limit', type: 'number', required: false })
    @ApiQuery({ name: 'page', type: 'number', required: false })
    @Get('/')
    @HttpCode(HttpStatus.OK)
    async getAll(
        @Query('limit') limit = Constant.controllerParams.LIMIT,
        @Query('page') page = Constant.controllerParams.PAGE,
    ): Promise<ApiResponse<Customer>> {
        if (limit <= 0) limit = Constant.controllerParams.LIMIT;
        if (page <= 0) page = Constant.controllerParams.PAGE;

        const [customers, count] = await this.customerService.findAll(
            limit,
            page,
        );

        const response: ApiResponse<Customer> = {
            statusCode: HttpStatus.OK,
            message: 'OK',
            results: customers,
            count,
        };
        return response;
    }

    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    async getById(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<ApiResponse<Customer>> {
        const response: ApiResponse<Customer> = {
            message: 'OK',
            statusCode: HttpStatus.OK,
            result: await this.customerService.findOne(id),
        };
        return response;
    }

    @Post('/')
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Body() body: CreateCustomerDTO,
    ): Promise<ApiResponse<Customer>> {
        const response: ApiResponse<Customer> = {
            message: 'Created',
            statusCode: HttpStatus.CREATED,
            result: await this.customerService.create(body),
        };
        return response;
    }

    @Put('/:id')
    @HttpCode(HttpStatus.OK)
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() body: UpdateCustomerDTO,
    ): Promise<ApiResponse<Customer>> {
        const response: ApiResponse<Customer> = {
            message: 'Updated',
            statusCode: HttpStatus.OK,
            result: await this.customerService.update(id, body),
        };
        return response;
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.OK)
    async delete(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<ApiResponse<Customer>> {
        const response: ApiResponse<Customer> = {
            message: 'Deleted',
            statusCode: HttpStatus.OK,
            result: await this.customerService.delete(id),
        };
        return response;
    }
}
