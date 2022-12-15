import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import { ApiResponse } from 'src/common/interface/api_response.interface';
import { ProductService } from 'src/product/service/product.service';
import { CustomerService } from 'src/user/service/customer.service';
import { CreateOrderDTO, UpdateOrderDTO } from '../dto/order.dto';
import { Order } from '../entity/order.entity';
import { OrderService } from '../service/order.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Order')
@Controller('order')
export class OrderController {
    constructor(
        private orderService: OrderService, // private customerService: CustomerService, // private productService: ProductService,
    ) {}

    @Get('/')
    @HttpCode(HttpStatus.OK)
    getAll(@Query('limit') limit = 10): ApiResponse<Order> {
        const response: ApiResponse<Order> = {
            statusCode: HttpStatus.OK,
            message: 'OK',
            results: this.orderService.findAll(),
        };
        return response;
    }

    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    getById(@Param('id', ParseIntPipe) id: number): ApiResponse<Order> {
        const response: ApiResponse<Order> = {
            message: 'OK',
            statusCode: HttpStatus.OK,
            result: this.orderService.findOne(id),
        };
        return response;
    }

    @Post('/')
    @HttpCode(HttpStatus.CREATED)
    create(@Body() body: CreateOrderDTO): ApiResponse<Order> {
        const order: Order = new Order();
        order.observation = body.observation;
        // order.customer = this.customerService.findOne(body.customerId);
        // order.products = this.productService.findMany(body.productsId);

        const response: ApiResponse<Order> = {
            message: 'Created',
            statusCode: HttpStatus.CREATED,
            result: this.orderService.create(order),
        };
        return response;
    }

    @Put('/:id')
    @HttpCode(HttpStatus.OK)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateOrderDTO,
    ): ApiResponse<Order> {
        const response: ApiResponse<Order> = {
            message: 'Updated',
            statusCode: HttpStatus.OK,
            result: this.orderService.update(id, body),
        };
        return response;
    }
}
