import { PartialType } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsUUID,
    ValidateIf,
} from 'class-validator';
import { BaseQueryDTO } from '../../common/dto/base_query.dto';
import { Transform } from 'class-transformer';

export class CreateOrderItemDTO {
    @IsUUID()
    @IsNotEmpty()
    order: string;

    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @IsUUID()
    @IsNotEmpty()
    product: string;
}

export class UpdateOrderItemDTO extends PartialType(CreateOrderItemDTO) {}

export class QueryOrderItemDTO extends BaseQueryDTO {
    @ValidateIf((orderItem) => orderItem.quantityEnd)
    @Transform(({ value }) => Number(value))
    @IsNumber()
    quantityInit?: number;

    @ValidateIf((orderItem) => orderItem.quantityInit)
    @Transform(({ value }) => Number(value))
    @IsNumber()
    quantityEnd?: number;

    @ValidateIf((orderItem) => orderItem.totalValueEnd)
    @Transform(({ value }) => Number(value))
    @IsNumber()
    totalValueInit?: number;

    @ValidateIf((orderItem) => orderItem.totalValueInit)
    @Transform(({ value }) => Number(value))
    @IsNumber()
    totalValueEnd?: number;

    @IsUUID()
    @IsOptional()
    orderId?: string;

    @IsUUID()
    @IsOptional()
    productId?: string;
}
