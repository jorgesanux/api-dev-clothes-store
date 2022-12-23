import { SetMetadata } from '@nestjs/common';
import { Constant } from '../../common/constant';
import { Role } from '../model/role.model';

export const Roles = (roles: Role[] = []) =>
    SetMetadata(Constant.metadataNames.ROLE, roles);
