import { PartialType } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    ValidateIf,
} from 'class-validator';
import { BaseQueryDTO } from '../../common/dto/base_query.dto';
import { Transform } from 'class-transformer';

export class CreateOrderDTO {
    @IsString()
    @IsOptional()
    observation: string;

    @IsUUID()
    @IsNotEmpty()
    customerId: string;
}

export class UpdateOrderDTO extends PartialType(CreateOrderDTO) {}

export class QueryOrderDTO extends BaseQueryDTO {
    @ValidateIf((order) => order.totalEnd)
    @Transform(({ value }) => Number(value))
    @IsNumber()
    // @IsOptional()
    totalInit?: number;

    @ValidateIf((order) => order.totalInit)
    @Transform(({ value }) => Number(value))
    @IsNumber()
    // @IsOptional()
    totalEnd?: number;

    @IsString()
    @IsOptional()
    observation?: string;
}
