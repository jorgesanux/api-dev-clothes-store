import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { BaseQueryDTO } from '../../common/dto/base_query.dto';
import { User } from '../entity/user.entity';

export class CreateCustomerDTO {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsString()
    companyName: string;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsUUID('4')
    @IsNotEmpty()
    userId: string;
}

export class UpdateCustomerDTO extends PartialType(CreateCustomerDTO) {}

export class QueryCustomerDTO extends BaseQueryDTO {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    lastName?: string;

    @IsString()
    @IsOptional()
    companyName?: string;

    @IsString()
    @IsOptional()
    address?: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsUUID()
    @IsOptional()
    userId?: string;
}
