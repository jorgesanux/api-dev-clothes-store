import { ClassSerializerInterceptor, Module, Provider } from "@nestjs/common";
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { DatabaseModule } from './database/database.module';
import config from './config';
import { APP_INTERCEPTOR } from "@nestjs/core";

const providerClassSerializerInterceptor: Provider<ClassSerializerInterceptor> = {
    provide: APP_INTERCEPTOR,
    useClass: ClassSerializerInterceptor
};

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            load: [config],
            isGlobal: true,
            //TODO: Validate how to do this schema validation with class-validator
            validationSchema: Joi.object({
                PG_HOST: Joi.string().required(),
                PG_PORT: Joi.number().required(),
                PG_DATABASE: Joi.string().required(),
                PG_USER: Joi.string().required(),
                PG_PASS: Joi.string().required(),
                PG_SSL: Joi.boolean().required(),
            }),
        }),
        UserModule,
        ProductModule,
        OrderModule,
        DatabaseModule,
    ],
    controllers: [AppController],
    providers: [
        providerClassSerializerInterceptor,
        AppService
    ],
})
export class AppModule {}
