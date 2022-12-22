import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    ParseUUIDPipe,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

import { ApiResponse } from 'src/common/interface/api_response.interface';
import { Category } from 'src/product/entity/category.entity';
import { CategoryService } from 'src/product/service/category.service';
import {
    CreateCategoryDTO,
    QueryCategoryDTO,
    UpdateCategoryDTO,
} from 'src/product/dto/category.dto';
import { Constant } from 'src/common/constant';
import { Public } from '../../auth/decorator/public.decorator';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
    constructor(private categoryService: CategoryService) {}

    @ApiQuery({ name: 'limit', type: 'number', required: false })
    @ApiQuery({ name: 'page', type: 'number', required: false })
    @ApiQuery({ name: 'name', type: 'string', required: false })
    @ApiQuery({ name: 'description', type: 'text', required: false })
    @ApiQuery({ name: 'createdAtInit', type: 'datetime', required: false })
    @ApiQuery({ name: 'createdAtEnd', type: 'datetime', required: false })
    @ApiQuery({ name: 'updatedAtInit', type: 'datetime', required: false })
    @ApiQuery({ name: 'updatedAtEnd', type: 'datetime', required: false })
    @Public()
    @Get('/')
    @HttpCode(HttpStatus.OK)
    async getAll(
        @Query() queryParams: QueryCategoryDTO,
    ): Promise<ApiResponse<Category>> {
        const [categories, count] = await this.categoryService.findAll(
            queryParams,
        );

        const response: ApiResponse<Category> = {
            statusCode: HttpStatus.OK,
            message: 'OK',
            results: categories,
            count,
        };
        return response;
    }

    @Public()
    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    async getById(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<ApiResponse<Category>> {
        const response: ApiResponse<Category> = {
            message: 'OK',
            statusCode: HttpStatus.OK,
            result: await this.categoryService.findOne(id),
        };
        return response;
    }

    @Post('/')
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Body() body: CreateCategoryDTO,
    ): Promise<ApiResponse<Category>> {
        const response: ApiResponse<Category> = {
            message: 'Created',
            statusCode: HttpStatus.CREATED,
            result: await this.categoryService.create(body),
        };
        return response;
    }

    @Put('/:id')
    @HttpCode(HttpStatus.OK)
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() body: UpdateCategoryDTO,
    ): Promise<ApiResponse<Category>> {
        const response: ApiResponse<Category> = {
            message: 'Updated',
            statusCode: HttpStatus.OK,
            result: await this.categoryService.update(id, body),
        };
        return response;
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.OK)
    async delete(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<ApiResponse<Category>> {
        const response: ApiResponse<Category> = {
            message: 'Deleted',
            statusCode: HttpStatus.OK,
            result: await this.categoryService.delete(id),
        };
        return response;
    }
}
