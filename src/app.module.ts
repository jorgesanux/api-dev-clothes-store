import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import * as Joi from "joi";

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import config from "./config";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ".env",
            load: [config],
            isGlobal: true,
            //TODO: Validate how to do this schema validation with class-validator
            validationSchema: Joi.object({
                PS_NAME: Joi.string().required(),
                PS_PORT: Joi.number().required(),
                API_KEY: Joi.string().required(),
            }),
        }),
        UserModule,
        ProductModule,
        OrderModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
