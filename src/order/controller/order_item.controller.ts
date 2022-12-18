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
import { Constant } from '../../common/constant';
import { CreateOrderItemDTO, UpdateOrderItemDTO } from '../dto/order_item.dto';
import { ApiResponse } from '../../common/interface/api_response.interface';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { OrderItemService } from '../service/order_item.service';
import { OrderItem } from '../entity/order_item.entity';
import { OrderItemQueryDTO } from '../dto/order_item_query.dto';

@ApiTags('Order item')
@Controller('orderItem')
export class OrderItemController {
    constructor(private orderItemService: OrderItemService) {}

    @ApiQuery({ name: 'limit', type: 'number', required: false })
    @ApiQuery({ name: 'page', type: 'number', required: false })
    @ApiQuery({ name: 'productId', type: 'uuidv4', required: false })
    @ApiQuery({ name: 'orderId', type: 'uuidv4', required: false })
    @ApiQuery({ name: 'quantityInit', type: 'number', required: false })
    @ApiQuery({ name: 'quantityEnd', type: 'number', required: false })
    @ApiQuery({ name: 'totalValueInit', type: 'number', required: false })
    @ApiQuery({ name: 'totalValueEnd', type: 'number', required: false })
    @ApiQuery({ name: 'createdAtInit', type: 'datetime', required: false })
    @ApiQuery({ name: 'createdAtEnd', type: 'datetime', required: false })
    @ApiQuery({ name: 'updatedAtInit', type: 'datetime', required: false })
    @ApiQuery({ name: 'updatedAtEnd', type: 'datetime', required: false })
    @Get('/')
    @HttpCode(HttpStatus.OK)
    async getAll(
        @Query() queryParams: OrderItemQueryDTO,
    ): Promise<ApiResponse<OrderItem>> {
        const [orderItems, count] = await this.orderItemService.findAll(
            queryParams,
        );

        const response: ApiResponse<OrderItem> = {
            statusCode: HttpStatus.OK,
            message: 'OK',
            results: orderItems,
            count,
        };
        return response;
    }

    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    async getById(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<ApiResponse<OrderItem>> {
        const response: ApiResponse<OrderItem> = {
            message: 'OK',
            statusCode: HttpStatus.OK,
            result: await this.orderItemService.findOne(id),
        };
        return response;
    }

    @Post('/')
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Body() body: CreateOrderItemDTO,
    ): Promise<ApiResponse<OrderItem>> {
        const response: ApiResponse<OrderItem> = {
            message: 'Created',
            statusCode: HttpStatus.CREATED,
            result: await this.orderItemService.create(body),
        };
        return response;
    }

    @Patch('/:id')
    @HttpCode(HttpStatus.OK)
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() body: UpdateOrderItemDTO,
    ): Promise<ApiResponse<OrderItem>> {
        const response: ApiResponse<OrderItem> = {
            message: 'Updated',
            statusCode: HttpStatus.OK,
            result: await this.orderItemService.update(id, body),
        };
        return response;
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.OK)
    async delete(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<ApiResponse<OrderItem>> {
        const response: ApiResponse<OrderItem> = {
            message: 'Deleted',
            statusCode: HttpStatus.OK,
            result: await this.orderItemService.delete(id),
        };
        return response;
    }
}
