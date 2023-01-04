import { IntersectionType, OmitType } from '@nestjs/swagger';
import { CreateUserDTO } from '../../user/dto/user.dto';
import { CreateCustomerDTO } from '../../user/dto/customer.dto';

export class SignupDTO extends IntersectionType(
    OmitType(CreateUserDTO, ['role'] as const),
    OmitType(CreateCustomerDTO, ['userId'] as const),
) {}
