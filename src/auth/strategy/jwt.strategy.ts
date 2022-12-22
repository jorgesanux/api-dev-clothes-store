import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy as PassportJwtStrategy } from "passport-jwt";
import config from "../../config";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { JWTPayloadModel } from "../model/jwt_payload.model";
import { User } from "../../user/entity/user.entity";
import { AuthService } from "../service/auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(PassportJwtStrategy) {
    constructor(
        @Inject(config.KEY) private configService: ConfigType<typeof config>,
        private authService: AuthService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.jwt.secret
        });
    }

    async validate(payload: JWTPayloadModel): Promise<User>{
        return payload.user;
    }
}
