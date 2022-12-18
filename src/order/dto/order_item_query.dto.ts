import { BaseQueryDTO } from '../../common/dto/base_query.dto';
import { IsNumber, IsOptional, IsUUID, ValidateIf } from 'class-validator';
import { Transform } from 'class-transformer';

export class OrderItemQueryDTO extends BaseQueryDTO {
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
