import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateOrderDTO {
    @IsString()
    @IsOptional()
    observation: string;

    @IsUUID()
    @IsNotEmpty()
    customerId: string;
}

export class UpdateOrderDTO extends PartialType(CreateOrderDTO) {}
