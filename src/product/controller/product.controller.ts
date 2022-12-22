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
    Put,
    Query,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

import { Product } from 'src/product/entity/product.entity';
import {
    CreateProductDTO,
    QueryProductDTO,
    UpdateProductDTO,
} from 'src/product/dto/product.dto';
import { ProductService } from 'src/product/service/product.service';
import { ApiResponse } from 'src/common/interface/api_response.interface';
import { Constant } from 'src/common/constant';
import { Public } from '../../auth/decorator/public.decorator';

@ApiTags('Product')
@Controller('product')
export class ProductController {
    constructor(private productService: ProductService) {}

    @ApiQuery({ name: 'limit', type: 'number', required: false })
    @ApiQuery({ name: 'page', type: 'number', required: false })
    @ApiQuery({ name: 'brandId', type: 'uuidv4', required: false })
    @ApiQuery({ name: 'categoryId', type: 'uuidv4', required: false })
    @ApiQuery({ name: 'priceInit', type: 'number', required: false })
    @ApiQuery({ name: 'priceEnd', type: 'number', required: false })
    @ApiQuery({ name: 'stockInit', type: 'number', required: false })
    @ApiQuery({ name: 'stockEnd', type: 'number', required: false })
    @ApiQuery({ name: 'name', type: 'string', required: false })
    @ApiQuery({ name: 'description', type: 'text', required: false })
    @ApiQuery({ name: 'image', type: 'text', required: false })
    @ApiQuery({ name: 'createdAtInit', type: 'datetime', required: false })
    @ApiQuery({ name: 'createdAtEnd', type: 'datetime', required: false })
    @ApiQuery({ name: 'updatedAtInit', type: 'datetime', required: false })
    @ApiQuery({ name: 'updatedAtEnd', type: 'datetime', required: false })
    @Public()
    @Get('/')
    @HttpCode(HttpStatus.OK)
    async getAll(
        @Query() queryParams: QueryProductDTO,
    ): Promise<ApiResponse<Product>> {
        const [products, count] = await this.productService.findAll(
            queryParams,
        );

        const response: ApiResponse<Product> = {
            statusCode: HttpStatus.OK,
            message: 'OK',
            results: products,
            count,
        };
        return response;
    }

    @Public()
    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    async getById(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<ApiResponse<Product>> {
        const response: ApiResponse<Product> = {
            message: 'OK',
            statusCode: HttpStatus.OK,
            result: await this.productService.findOne(id),
        };
        return response;
    }

    @Post('/')
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Body() body: CreateProductDTO,
    ): Promise<ApiResponse<Product>> {
        const response: ApiResponse<Product> = {
            message: 'Created',
            statusCode: HttpStatus.CREATED,
            result: await this.productService.create(body),
        };
        return response;
    }

    @Patch('/:id')
    @HttpCode(HttpStatus.OK)
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() body: UpdateProductDTO,
    ): Promise<ApiResponse<Product>> {
        const response: ApiResponse<Product> = {
            message: 'Updated',
            statusCode: HttpStatus.OK,
            result: await this.productService.update(id, body),
        };
        return response;
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.OK)
    async delete(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<ApiResponse<Product>> {
        const response: ApiResponse<Product> = {
            message: 'Deleted',
            statusCode: HttpStatus.OK,
            result: await this.productService.delete(id),
        };
        return response;
    }

    /***** Operations on Category array relation *****/

    @Patch('/:idProduct/category/:idCategory')
    @HttpCode(HttpStatus.OK)
    async addCategory(
        @Param('idProduct', ParseUUIDPipe) idProduct: string,
        @Param('idCategory', ParseUUIDPipe) idCategory: string,
    ): Promise<ApiResponse<Product>> {
        const response: ApiResponse<Product> = {
            message: 'Updated',
            statusCode: HttpStatus.OK,
            result: await this.productService.addCategory(
                idProduct,
                idCategory,
            ),
        };
        return response;
    }

    @Delete('/:idProduct/category/:idCategory')
    @HttpCode(HttpStatus.OK)
    async deleteCategory(
        @Param('idProduct', ParseUUIDPipe) idProduct: string,
        @Param('idCategory', ParseUUIDPipe) idCategory: string,
    ): Promise<ApiResponse<Product>> {
        const response: ApiResponse<Product> = {
            message: 'Deleted',
            statusCode: HttpStatus.OK,
            result: await this.productService.deleteCategory(
                idProduct,
                idCategory,
            ),
        };
        return response;
    }
}
