import { registerAs } from "@nestjs/config";

export default registerAs('config', ()=> {
    return {
        database: {
            postgresql: {
                name: process.env.PS_NAME,
                port: process.env.PS_PORT,
            }
        },
        api: {
            geoloc: {
                key: process.env.API_KEY
            }
        }
    };
});
