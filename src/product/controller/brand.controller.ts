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
import { CreateBrandDTO, UpdateBrandDTO } from 'src/product/dto/brand.dto';
import { Brand } from 'src/product/entity/brand.entity';
import { ApiResponse } from 'src/common/interface/api_response.interface';
import { BrandService } from 'src/product/service/brand.service';
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Brand")
@Controller('brand')
export class BrandController {
    constructor(private brandService: BrandService) {}

    @Get('/')
    @HttpCode(HttpStatus.OK)
    getAll(@Query('limit') limit = 10): ApiResponse<Brand> {
        const response: ApiResponse<Brand> = {
            statusCode: HttpStatus.OK,
            message: 'OK',
            results: this.brandService.findAll(),
        };
        return response;
    }

    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    getById(@Param('id', ParseIntPipe) id: number): ApiResponse<Brand> {
        const response: ApiResponse<Brand> = {
            message: 'OK',
            statusCode: HttpStatus.OK,
            result: this.brandService.findOne(id),
        };
        return response;
    }

    @Post('/')
    @HttpCode(HttpStatus.CREATED)
    create(@Body() body: CreateBrandDTO): ApiResponse<Brand> {
        const response: ApiResponse<Brand> = {
            message: 'Created',
            statusCode: HttpStatus.CREATED,
            result: this.brandService.create(body),
        };
        return response;
    }

    @Put('/:id')
    @HttpCode(HttpStatus.OK)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateBrandDTO,
    ): ApiResponse<Brand> {
        const response: ApiResponse<Brand> = {
            message: 'Updated',
            statusCode: HttpStatus.OK,
            result: this.brandService.update(id, body),
        };
        return response;
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.OK)
    delete(@Param('id', ParseIntPipe) id: number): ApiResponse<Brand> {
        const response: ApiResponse<Brand> = {
            message: 'Deleted',
            statusCode: HttpStatus.OK,
            result: this.brandService.delete(id),
        };
        return response;
    }
}
