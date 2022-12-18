import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { ApiResponse } from 'src/common/interface/api_response.interface';
import { CustomerService } from 'src/user/service/customer.service';
import { CreateOrderDTO, UpdateOrderDTO } from '../dto/order.dto';
import { Order } from '../entity/order.entity';
import { OrderService } from '../service/order.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Constant } from 'src/common/constant';
import { OrderQueryDTO } from '../dto/order_query.dto';
import { plainToClass } from 'class-transformer';

@ApiTags('Order')
@Controller('order')
export class OrderController {
    constructor(private orderService: OrderService) {}

    @ApiQuery({ name: 'limit', type: 'number', required: false })
    @ApiQuery({ name: 'page', type: 'number', required: false })
    @ApiQuery({ name: 'totalInit', type: 'number', required: false })
    @ApiQuery({ name: 'totalEnd', type: 'number', required: false })
    @ApiQuery({ name: 'observation', type: 'text', required: false })
    @ApiQuery({ name: 'createdAtInit', type: 'datetime', required: false })
    @ApiQuery({ name: 'createdAtEnd', type: 'datetime', required: false })
    @ApiQuery({ name: 'updatedAtInit', type: 'datetime', required: false })
    @ApiQuery({ name: 'updatedAtEnd', type: 'datetime', required: false })
    @Get('/')
    @HttpCode(HttpStatus.OK)
    async getAll(
        @Query() queryParams: OrderQueryDTO,
    ): Promise<ApiResponse<Order>> {
        const [orders, count] = await this.orderService.findAll(queryParams);

        const response: ApiResponse<Order> = {
            statusCode: HttpStatus.OK,
            message: 'OK',
            results: orders,
            count,
        };
        return response;
    }

    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    async getById(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<ApiResponse<Order>> {
        const response: ApiResponse<Order> = {
            message: 'OK',
            statusCode: HttpStatus.OK,
            result: await this.orderService.findOne(id),
        };
        return response;
    }

    @Post('/')
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() body: CreateOrderDTO): Promise<ApiResponse<Order>> {
        const response: ApiResponse<Order> = {
            message: 'Created',
            statusCode: HttpStatus.CREATED,
            result: await this.orderService.create(body),
        };
        return response;
    }

    @Patch('/:id')
    @HttpCode(HttpStatus.OK)
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() body: UpdateOrderDTO,
    ): Promise<ApiResponse<Order>> {
        const response: ApiResponse<Order> = {
            message: 'Updated',
            statusCode: HttpStatus.OK,
            result: await this.orderService.update(id, body),
        };
        return response;
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.OK)
    async delete(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<ApiResponse<Order>> {
        const response: ApiResponse<Order> = {
            message: 'Deleted',
            statusCode: HttpStatus.OK,
            result: await this.orderService.delete(id),
        };
        return response;
    }
}
