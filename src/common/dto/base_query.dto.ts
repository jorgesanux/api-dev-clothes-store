import {
    IsDate,
    IsNumber,
    IsOptional,
    IsPositive,
    ValidateIf,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ParseIntPipe } from '@nestjs/common';
import { Constant } from '../constant';

export abstract class BaseQueryDTO {
    @Transform(({ value }) => Number(value))
    @IsNumber()
    @IsPositive()
    @IsOptional()
    limit?: number = Constant.controllerParams.LIMIT;

    @Transform(({ value }) => Number(value))
    @IsNumber()
    @IsPositive()
    @IsOptional()
    page?: number = Constant.controllerParams.PAGE;

    @ValidateIf((entity) => entity.createdAtEnd)
    @Type(() => Date)
    @IsDate()
    // @IsOptional()
    createdAtInit?: Date;

    @ValidateIf((entity) => entity.createdAtInit)
    @Type(() => Date)
    @IsDate()
    // @IsOptional()
    createdAtEnd?: Date;

    @ValidateIf((entity) => entity.createdAtEnd)
    @Type(() => Date)
    @IsDate()
    // @IsOptional()
    updatedAtInit?: Date;

    @ValidateIf((entity) => entity.createdAtInit)
    @Type(() => Date)
    @IsDate()
    // @IsOptional()
    updatedAtEnd?: Date;
}
