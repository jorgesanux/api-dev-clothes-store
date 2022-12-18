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

import { CreateBrandDTO, UpdateBrandDTO } from 'src/product/dto/brand.dto';
import { Brand } from 'src/product/entity/brand.entity';
import { ApiResponse } from 'src/common/interface/api_response.interface';
import { BrandService } from 'src/product/service/brand.service';
import { Constant } from 'src/common/constant';
import { BrandQueryDTO } from "../dto/brand_query.dto";

@ApiTags('Brand')
@Controller('brand')
export class BrandController {
    constructor(private brandService: BrandService) {}

    @ApiQuery({ name: 'limit', type: 'number', required: false })
    @ApiQuery({ name: 'page', type: 'number', required: false })
    @ApiQuery({ name: 'name', type: 'string', required: false })
    @ApiQuery({ name: 'description', type: 'text', required: false })
    @ApiQuery({ name: 'createdAtInit', type: 'datetime', required: false })
    @ApiQuery({ name: 'createdAtEnd', type: 'datetime', required: false })
    @ApiQuery({ name: 'updatedAtInit', type: 'datetime', required: false })
    @ApiQuery({ name: 'updatedAtEnd', type: 'datetime', required: false })
    @Get('/')
    @HttpCode(HttpStatus.OK)
    async getAll(
        @Query() queryParams: BrandQueryDTO
    ): Promise<ApiResponse<Brand>> {
        const [brands, count] = await this.brandService.findAll(queryParams);

        const response: ApiResponse<Brand> = {
            statusCode: HttpStatus.OK,
            message: 'OK',
            results: brands,
            count,
        };
        return response;
    }

    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    async getById(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<ApiResponse<Brand>> {
        const response: ApiResponse<Brand> = {
            message: 'OK',
            statusCode: HttpStatus.OK,
            result: await this.brandService.findOne(id),
        };
        return response;
    }

    @Post('/')
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() body: CreateBrandDTO): Promise<ApiResponse<Brand>> {
        const response: ApiResponse<Brand> = {
            message: 'Created',
            statusCode: HttpStatus.CREATED,
            result: await this.brandService.create(body),
        };
        return response;
    }

    @Put('/:id')
    @HttpCode(HttpStatus.OK)
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() body: UpdateBrandDTO,
    ): Promise<ApiResponse<Brand>> {
        const response: ApiResponse<Brand> = {
            message: 'Updated',
            statusCode: HttpStatus.OK,
            result: await this.brandService.update(id, body),
        };
        return response;
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.OK)
    async delete(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<ApiResponse<Brand>> {
        const response: ApiResponse<Brand> = {
            message: 'Deleted',
            statusCode: HttpStatus.OK,
            result: await this.brandService.delete(id),
        };
        return response;
    }
}
