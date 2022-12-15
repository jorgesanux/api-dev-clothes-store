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
} from 'class-validator';

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
