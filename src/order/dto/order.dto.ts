import { PartialType } from '@nestjs/mapped-types';
import {
    IsArray,
    IsEmpty,
    IsNotEmpty,
    IsNumber,
    IsString,
} from 'class-validator';

export class CreateOrderDTO {
    @IsString()
    @IsEmpty()
    observation: string;

    @IsNumber()
    @IsNotEmpty()
    customerId: number;

    @IsArray()
    @IsNotEmpty()
    productsId: number[];
}

export class UpdateOrderDTO extends PartialType(CreateOrderDTO) {}
