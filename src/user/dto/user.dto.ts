import { PartialType } from '@nestjs/swagger';
import {
    IsDateString,
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
} from 'class-validator';
import { BaseQueryDTO } from '../../common/dto/base_query.dto';
import { Customer } from '../entity/customer.entity';

export class CreateUserDTO {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    role: string;
}

export class UpdateUserDTO extends PartialType(CreateUserDTO) {}

export class QueryUserDTO extends BaseQueryDTO {
    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    role?: string;
}
