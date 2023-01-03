import {
    ClassSerializerInterceptor,
    DynamicModule,
    Inject,
    Module,
    Provider,
} from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import * as Joi from 'joi';
import { join } from 'path';

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
import { ServeStaticModule } from '@nestjs/serve-static';
import { EmailModule } from './email/email.module';
import { EmailConfigOptions } from './email/interface/email_config_options.interface';

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
        MAIL_HOST: Joi.string().required(),
        MAIL_PORT: Joi.number().required(),
        MAIL_USER: Joi.string().required(),
        MAIL_PASS: Joi.string().required(),
    }),
});

const serveStaticModule: DynamicModule = ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'public'),
    serveRoot: '/public',
});

const emailModule: DynamicModule = EmailModule.forRootAsync({
    useFactory: (
        configService: ConfigType<typeof config>,
    ): EmailConfigOptions => {
        return {
            smtpTransportConfig: {
                host: configService.email.host,
                port: configService.email.port,
                auth: {
                    user: configService.email.user,
                    pass: configService.email.pass,
                },
            },
            smtpTransportDefaults: {
                from: 'Clothes Store <noreply@clothesstore.com>',
            },
        };
    },
    inject: [config.KEY],
    isGlobal: true,
});

@Module({
    imports: [
        configModule,
        RouterModule.register(AppRoute),
        emailModule,
        ApiModule,
        serveStaticModule,
    ],
    controllers: [AppController],
    providers: [
        providerClassSerializerInterceptor,
        providerJwtAuthGuard,
        providerRolesGuard,
        AppService,
    ],
})
export class AppModule {}
