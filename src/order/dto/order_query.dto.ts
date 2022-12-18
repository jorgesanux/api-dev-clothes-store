import { BaseQueryDTO } from '../../common/dto/base_query.dto';
import {
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class OrderQueryDTO extends BaseQueryDTO {
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
