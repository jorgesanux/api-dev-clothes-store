import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BaseQueryDTO } from '../../common/dto/base_query.dto';

export class CreateCategoryDTO {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;
}

export class UpdateCategoryDTO extends PartialType(CreateCategoryDTO) {}

export class QueryCategoryDTO extends BaseQueryDTO {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;
}
