import { registerAs } from '@nestjs/config';
import { Constant } from './common/constant';
import * as process from 'process';

export default registerAs(Constant.providerKeys.ENV_CONFIG, () => {
    return {
        database: {
            postgresql: {
                host: process.env.PG_HOST,
                port: Number(process.env.PG_PORT),
                database: process.env.PG_DATABASE,
                user: process.env.PG_USER,
                pass: process.env.PG_PASS,
                ssl: process.env.PG_SSL === 'true',
            },
        },
        jwt: {
            secret: process.env.JWT_SECRET,
        },
        email: {
            host: process.env.MAIL_HOST,
            port: Number(process.env.MAIL_PORT),
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    };
});
