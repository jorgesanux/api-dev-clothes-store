import { PassportStrategy } from '@nestjs/passport';
import { Strategy as PassportLocalStrategy } from 'passport-local';
import { AuthService } from '../service/auth.service';
import { User } from '../../user/entity/user.entity';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(PassportLocalStrategy) {
    constructor(private authService: AuthService) {
        super({
            usernameField: 'email',
            passwordField: 'password',
        });
    }

    async validate(username: string, password: string): Promise<User> {
        const user: User = await this.authService.validateUser(
            username,
            password,
        );
        if (!user)
            throw new UnauthorizedException(
                "Email or password doesn't match anything",
            );
        return user;
    }
}
