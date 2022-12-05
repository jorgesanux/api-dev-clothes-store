import { PartialType } from '@nestjs/mapped-types';
import { IsDateString, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDTO {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsDateString()
    @IsNotEmpty()
    birthDate: Date;

    @IsEmail()
    @IsNotEmpty()
    email: string;
}

export class UpdateUserDTO extends PartialType(CreateUserDTO) {}
