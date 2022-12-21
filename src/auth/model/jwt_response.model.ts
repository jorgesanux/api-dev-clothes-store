import { User } from '../../user/entity/user.entity';

export interface JWTResponseModel {
    accessToken: string;
    user: User;
    expiresIn: number;
    exp: number;
}
