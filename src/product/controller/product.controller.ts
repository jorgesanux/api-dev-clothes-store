import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    // ParseIntPipe,
} from '@nestjs/common';

import { ParseIntPipe } from 'src/common/pipe/parse-int.pipe';

import { Product } from 'src/product/entity/product.entity';
import {
    CreateProductDTO,
    UpdateProductDTO,
} from 'src/product/dto/product.dto';
import { ProductService } from 'src/product/service/product.service';
import { ApiResponse } from 'src/common/interface/api-response.interface';

@Controller('product')
export class ProductController {
    constructor(private productService: ProductService) {}

    @Get('/')
    @HttpCode(HttpStatus.OK)
    getAll(@Query('limit') limit = 10): ApiResponse<Product> {
        const response: ApiResponse<Product> = {
            statusCode: HttpStatus.OK,
            message: 'OK',
            results: this.productService.findAll(),
        };
        return response;
    }

    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    getById(@Param('id', ParseIntPipe) id: number): ApiResponse<Product> {
        const response: ApiResponse<Product> = {
            message: 'OK',
            statusCode: HttpStatus.OK,
            result: this.productService.findOne(id),
        };
        return response;
    }

    @Post('/')
    @HttpCode(HttpStatus.CREATED)
    create(@Body() body: CreateProductDTO): ApiResponse<Product> {
        const response: ApiResponse<Product> = {
            message: 'Created',
            statusCode: HttpStatus.CREATED,
            result: this.productService.create(body),
        };
        return response;
    }

    @Put('/:id')
    @HttpCode(HttpStatus.OK)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateProductDTO,
    ): ApiResponse<Product> {
        const response: ApiResponse<Product> = {
            message: 'Updated',
            statusCode: HttpStatus.OK,
            result: this.productService.update(id, body),
        };
        return response;
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.OK)
    delete(@Param('id', ParseIntPipe) id: number): ApiResponse<Product> {
        const response: ApiResponse<Product> = {
            message: 'Deleted',
            statusCode: HttpStatus.OK,
            result: this.productService.delete(id),
        };
        return response;
    }
}
