import { User } from '../../user/entity/user.entity';

export interface JWTPayloadModel {
    sub: string;
    user: User;
    exp?: number;
    iat?: number;
}
