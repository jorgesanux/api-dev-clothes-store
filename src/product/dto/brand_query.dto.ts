import { BaseQueryDTO } from "../../common/dto/base_query.dto";
import { IsOptional, IsString } from "class-validator";

export class BrandQueryDTO extends BaseQueryDTO {

    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    description: string;
}
