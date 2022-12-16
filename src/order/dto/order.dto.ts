import { PartialType } from '@nestjs/swagger';
import {
    ArrayNotEmpty,
    IsArray,
    IsEmpty,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
} from 'class-validator';
import { CreateOrderItemDTO, UpdateOrderItemDTO } from './order_item.dto';

export class CreateOrderDTO {
    @IsString()
    @IsOptional()
    observation: string;

    @IsUUID()
    @IsNotEmpty()
    customer: string;

    @IsArray()
    @ArrayNotEmpty()
    orderItems: CreateOrderItemDTO[];
}

export class UpdateOrderDTO extends PartialType(CreateOrderDTO) {}
