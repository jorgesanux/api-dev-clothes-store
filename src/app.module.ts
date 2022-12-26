import {
    ClassSerializerInterceptor,
    DynamicModule,
    Module,
    Provider,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { DatabaseModule } from './database/database.module';
import config from './config';
import { APP_GUARD, APP_INTERCEPTOR, RouterModule } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guard/jwt_auth.guard';
import { RolesGuard } from './auth/guard/roles.guard';
import { ApiModule } from './api/api.module';
import { AppRoute } from './app.route';

/* Providers */
const providerClassSerializerInterceptor: Provider<ClassSerializerInterceptor> =
    {
        provide: APP_INTERCEPTOR,
        useClass: ClassSerializerInterceptor,
    };

/***
    Provider to apply the JwtAuthGuard to all application.
    Use the @Public() decorator to expose something without authentication.
***/
const providerJwtAuthGuard: Provider<JwtAuthGuard> = {
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
};

/***
     Provider to apply the RolesGuard to all application.
     Use the @Roles() decorator to add roles to something.
 ***/
const providerRolesGuard: Provider<RolesGuard> = {
    provide: APP_GUARD,
    useClass: RolesGuard,
};

/* Modules */
const configModule: DynamicModule = ConfigModule.forRoot({
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
        JWT_SECRET: Joi.string().required(),
    }),
});

@Module({
    imports: [configModule, RouterModule.register(AppRoute), ApiModule],
    controllers: [AppController],
    providers: [
        providerClassSerializerInterceptor,
        providerJwtAuthGuard,
        providerRolesGuard,
        AppService,
    ],
})
export class AppModule {}
