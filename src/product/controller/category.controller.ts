import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe, ParseUUIDPipe,
    Post,
    Put,
    Query
} from "@nestjs/common";
import { ApiQuery, ApiTags } from "@nestjs/swagger";

import { ApiResponse } from 'src/common/interface/api_response.interface';
import { Category } from 'src/product/entity/category.entity';
import { CategoryService } from 'src/product/service/category.service';
import {
    CreateCategoryDTO,
    UpdateCategoryDTO,
} from 'src/product/dto/category.dto';
import { Constant } from "src/common/constant";

@ApiTags('Category')
@Controller('category')
export class CategoryController {
    constructor(private categoryService: CategoryService) {}

    @ApiQuery({ name: 'limit', type: 'number', required: false })
    @ApiQuery({ name: 'page', type: 'number', required: false })
    @Get('/')
    @HttpCode(HttpStatus.OK)
    async getAll(
        @Query('limit') limit = Constant.controllerParams.LIMIT,
        @Query('page') page = Constant.controllerParams.PAGE,
    ): Promise<ApiResponse<Category>> {
        if (limit <= 0) limit = Constant.controllerParams.LIMIT;
        if (page <= 0) page = Constant.controllerParams.PAGE;

        const [categorys, count] = await this.categoryService.findAll(limit, page);

        const response: ApiResponse<Category> = {
            statusCode: HttpStatus.OK,
            message: 'OK',
            results: categorys,
            count,
        };
        return response;
    }

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
    async create(@Body() body: CreateCategoryDTO): Promise<ApiResponse<Category>> {
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
