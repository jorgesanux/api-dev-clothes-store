import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../../user/service/user.service';
import { User } from '../../user/entity/user.entity';
import { AuthHelper } from '../../common/helper/auth.helper';
import { CastHelper } from '../../common/helper/cast.helper';
import { JwtService } from '@nestjs/jwt';
import { JWTPayloadModel } from '../model/jwt_payload.model';
import { JWTResponseModel } from '../model/jwt_response.model';
import { defaultOptions } from 'class-transformer/types/constants/default-options.constant';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) {}

    async validateUser(email: string, password: string): Promise<User> {
        try {
            const user: User = await this.userService.findByEmail(email);
            if (!user) return null;

            const isValidPassword: boolean = await AuthHelper.comparePassword(
                password,
                CastHelper.BufferToString(user.password),
            );
            if (!isValidPassword) return null;

            delete user.password;
            return user;
        } catch (e: unknown) {
            if (e instanceof NotFoundException) return null;
            throw e;
        }
    }

    generateToken(user: User): JWTResponseModel {
        const payload: JWTPayloadModel = {
            sub: user.id,
            user
        };
        const token: string = this.jwtService.sign(payload);
        const decodedToken: JWTPayloadModel = this.jwtService.decode(token, {
            json: true,
        }) as JWTPayloadModel;

        return {
            accessToken: token,
            expiresIn: AuthHelper.calculateTimeToExpire(decodedToken.exp),
            exp: decodedToken.exp,
            user,
        };
    }
}
