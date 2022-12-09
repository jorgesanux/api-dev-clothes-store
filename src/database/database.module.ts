import { Global, Module, Provider } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { Client } from "pg";

import config from "../config";
import { Constant } from "../common/constant";

const databaseProvider: Provider<Client> = {
    provide: Constant.providerKeys.PG_CLIENT,
    useFactory: async (configProperties: ConfigType<typeof config>) => {
        let client: Client = new Client({
            host: configProperties.database.postgresql.host,
            port: configProperties.database.postgresql.port,
            database: configProperties.database.postgresql.database,
            user: configProperties.database.postgresql.user,
            password: configProperties.database.postgresql.pass,
        });
        await client.connect();
        return client;
    },
    inject: [config.KEY]
};
@Global()
@Module({
    providers: [ databaseProvider ],
    exports: [ Constant.providerKeys.PG_CLIENT ]
})
export class DatabaseModule {}
