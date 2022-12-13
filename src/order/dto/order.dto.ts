import { PartialType } from '@nestjs/swagger';
import {
    IsArray,
    IsEmpty,
    IsNotEmpty,
    IsNumber,
    IsString, IsUUID
} from "class-validator";

export class CreateOrderDTO {
    @IsString()
    @IsEmpty()
    observation: string;

    @IsUUID()
    @IsNotEmpty()
    customerId: string;

    @IsUUID(4, {
        each: true
    })
    @IsNotEmpty()
    productsId: string[];
}

export class UpdateOrderDTO extends PartialType(CreateOrderDTO) {}
