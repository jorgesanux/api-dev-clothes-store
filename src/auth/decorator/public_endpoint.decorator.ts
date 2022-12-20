import { SetMetadata } from '@nestjs/common';
import { Constant } from '../../common/constant';

export const PublicEndpoint = (isPublic: boolean = true) =>
    SetMetadata(Constant.metadataNames.PUBLIC_ENDPOINT, isPublic);
