import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateOrderItemDTO {
    @IsUUID()
    @IsNotEmpty()
    order: string;

    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @IsUUID()
    @IsNotEmpty()
    product: string;
}

export class UpdateOrderItemDTO extends PartialType(CreateOrderItemDTO) {
    @IsUUID()
    order: string;
}
