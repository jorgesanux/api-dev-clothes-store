import { PartialType } from '@nestjs/swagger';
import {
    IsString,
    IsNumber,
    IsUrl,
    IsNotEmpty,
    IsPositive,
    IsUUID,
    IsArray,
    ArrayNotEmpty,
    IsOptional,
    ValidateIf,
} from 'class-validator';
import { BaseQueryDTO } from '../../common/dto/base_query.dto';
import { Brand } from '../entity/brand.entity';
import { Transform } from 'class-transformer';
import { Category } from '../entity/category.entity';

export class CreateProductDTO {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    readonly description: string;

    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    readonly price: number;

    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    readonly stock: number;

    @IsUrl()
    @IsNotEmpty()
    readonly image: string;

    @IsUUID('4')
    @IsNotEmpty()
    brandId: string;

    @IsArray()
    @ArrayNotEmpty()
    @IsUUID('4', { each: true })
    categoriesIds: string[];
}

export class UpdateProductDTO extends PartialType(CreateProductDTO) {}

export class QueryProductDTO extends BaseQueryDTO {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @ValidateIf((product) => product.priceEnd)
    @Transform(({ value }) => Number(value))
    @IsNumber()
    priceInit?: number;

    @ValidateIf((product) => product.priceInit)
    @Transform(({ value }) => Number(value))
    @IsNumber()
    priceEnd?: number;

    @ValidateIf((product) => product.stockEnd)
    @Transform(({ value }) => Number(value))
    @IsNumber()
    stockInit?: number;

    @ValidateIf((product) => product.stockInit)
    @Transform(({ value }) => Number(value))
    @IsNumber()
    stockEnd?: number;

    @IsUrl()
    @IsOptional()
    image?: string;

    @IsUUID()
    @IsOptional()
    brandId?: string;

    @IsUUID()
    @IsOptional()
    categoryId?: string;
}
