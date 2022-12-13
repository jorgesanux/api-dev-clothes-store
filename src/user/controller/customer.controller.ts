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
import {
    CreateCustomerDTO,
    UpdateCustomerDTO,
} from 'src/user/dto/customer.dto';
import { Customer } from 'src/user/entity/customer.entity';
import { ApiResponse } from 'src/common/interface/api_response.interface';
import { CustomerService } from 'src/user/service/customer.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Customer')
@Controller('customer')
export class CustomerController {
    constructor(private customerService: CustomerService) {}

    @Get('/')
    @HttpCode(HttpStatus.OK)
    getAll(@Query('limit') limit = 10): ApiResponse<Customer> {
        const response: ApiResponse<Customer> = {
            statusCode: HttpStatus.OK,
            message: 'OK',
            results: this.customerService.findAll(),
        };
        return response;
    }

    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    getById(@Param('id', ParseIntPipe) id: number): ApiResponse<Customer> {
        const response: ApiResponse<Customer> = {
            message: 'OK',
            statusCode: HttpStatus.OK,
            result: this.customerService.findOne(id),
        };
        return response;
    }

    @Post('/')
    @HttpCode(HttpStatus.CREATED)
    create(@Body() body: CreateCustomerDTO): ApiResponse<Customer> {
        const response: ApiResponse<Customer> = {
            message: 'Created',
            statusCode: HttpStatus.CREATED,
            result: this.customerService.create(body),
        };
        return response;
    }

    @Put('/:id')
    @HttpCode(HttpStatus.OK)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateCustomerDTO,
    ): ApiResponse<Customer> {
        const response: ApiResponse<Customer> = {
            message: 'Updated',
            statusCode: HttpStatus.OK,
            result: this.customerService.update(id, body),
        };
        return response;
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.OK)
    delete(@Param('id', ParseIntPipe) id: number): ApiResponse<Customer> {
        const response: ApiResponse<Customer> = {
            message: 'Deleted',
            statusCode: HttpStatus.OK,
            result: this.customerService.delete(id),
        };
        return response;
    }
}
