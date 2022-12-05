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

import { ApiResponse } from 'src/common/interface/api-response.interface';
import { Category } from 'src/product/entity/category.entity';
import { CategoryService } from 'src/product/service/category.service';
import {
    CreateCategoryDTO,
    UpdateCategoryDTO,
} from 'src/product/dto/category.dto';

@Controller('category')
export class CategoryController {
    constructor(private categoryService: CategoryService) {}

    @Get('/')
    @HttpCode(HttpStatus.OK)
    getAll(@Query('limit') limit = 10): ApiResponse<Category> {
        const response: ApiResponse<Category> = {
            statusCode: HttpStatus.OK,
            message: 'OK',
            results: this.categoryService.findAll(),
        };
        return response;
    }

    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    getById(
        @Param('id', ParseIntPipe) idProduct: number,
    ): ApiResponse<Category> {
        const response: ApiResponse<Category> = {
            message: 'OK',
            statusCode: HttpStatus.OK,
            result: this.categoryService.findOne(idProduct),
        };
        return response;
    }

    @Post('/')
    @HttpCode(HttpStatus.CREATED)
    create(@Body() body: CreateCategoryDTO): ApiResponse<Category> {
        const response: ApiResponse<Category> = {
            message: 'Created',
            statusCode: HttpStatus.CREATED,
            result: this.categoryService.create(body),
        };
        return response;
    }

    @Put('/:id')
    @HttpCode(HttpStatus.OK)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateCategoryDTO,
    ): ApiResponse<Category> {
        const response: ApiResponse<Category> = {
            message: 'Updated',
            statusCode: HttpStatus.OK,
            result: this.categoryService.update(id, body),
        };
        return response;
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.OK)
    delete(@Param('id', ParseIntPipe) id: number): ApiResponse<Category> {
        const response: ApiResponse<Category> = {
            message: 'Deleted',
            statusCode: HttpStatus.OK,
            result: this.categoryService.delete(id),
        };
        return response;
    }
}
