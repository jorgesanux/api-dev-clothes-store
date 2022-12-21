import * as bcrypt from 'bcrypt';
import { Constant } from '../constant';

export class AuthHelper {
    static async hashPassword(password: string): Promise<string> {
        const salt: string = await bcrypt.genSalt(
            Constant.authParams.ROUNDS_HASH_PASSWORD,
        );
        return bcrypt.hash(password, salt);
    }

    static async comparePassword(
        password: string,
        hashedPassword: string,
    ): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }
}
