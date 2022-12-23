import { SetMetadata } from '@nestjs/common';
import { Constant } from '../../common/constant';

export const Public = (isPublic: boolean = true) =>
    SetMetadata(Constant.metadataNames.IS_PUBLIC, isPublic);
