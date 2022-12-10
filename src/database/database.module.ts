import { DynamicModule, Global, Module } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";

import config from "../config";

const typeOrmModule: DynamicModule = TypeOrmModule.forRootAsync({
    useFactory: async (configProperties: ConfigType<typeof config>): Promise<TypeOrmModuleOptions> => {
        return {
            type: "postgres",
            host: configProperties.database.postgresql.host,
            port: configProperties.database.postgresql.port,
            database: configProperties.database.postgresql.database,
            username: configProperties.database.postgresql.user,
            password: configProperties.database.postgresql.pass,
            entities: [],
            synchronize: true, //Not recommended for production
            autoLoadEntities: true
        };
    },
    inject: [config.KEY]
});

@Global()
@Module({
    imports: [ typeOrmModule ],
    providers: [],
    exports: [
        typeOrmModule
    ]
})
export class DatabaseModule {}
