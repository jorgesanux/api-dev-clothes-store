import { registerAs } from '@nestjs/config';
import { Constant } from './common/constant';

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
    };
});
