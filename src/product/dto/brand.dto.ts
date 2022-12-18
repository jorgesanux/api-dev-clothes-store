import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BaseQueryDTO } from '../../common/dto/base_query.dto';

export class CreateBrandDTO {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;
}

export class UpdateBrandDTO extends PartialType(CreateBrandDTO) {}

export class QueryBrandDTO extends BaseQueryDTO {
    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    description: string;
}
