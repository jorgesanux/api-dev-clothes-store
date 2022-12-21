import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../../user/service/user.service';
import { User } from '../../user/entity/user.entity';
import { AuthHelper } from '../../common/helper/auth.helper';
import { CastHelper } from '../../common/helper/cast.helper';

@Injectable()
export class AuthService {
    constructor(private userService: UserService) {}

    async validateUser(email: string, password: string): Promise<User> {
        try {
            const user: User = await this.userService.findByEmail(email);
            if (!user) return null;

            const isValidPassword: boolean = await AuthHelper.comparePassword(
                password,
                CastHelper.BufferToString(user?.password),
            );
            if (!isValidPassword) return null;

            return user;
        } catch (e: unknown) {
            if (e instanceof NotFoundException) return null;
            throw e;
        }
    }
}
