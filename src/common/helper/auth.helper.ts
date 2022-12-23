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

    /**
     * Calculates the expiration time from present to future date.
     * @param timeStampExpiration Future timestamp time in milliseconds.
     * @param divisibleFactor Factor to divide the timestamp. Default is 1000 to obtain the result in seconds.
     */
    static calculateTimeToExpire(
        timeStampExpiration: number,
        divisibleFactor = 1000,
    ): number {
        return timeStampExpiration - Math.ceil(Date.now() / divisibleFactor);
    }
}
