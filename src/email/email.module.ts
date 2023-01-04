import { DynamicModule, Module, ModuleMetadata } from '@nestjs/common';
import { EmailService } from './service/email.service';
import {
    EmailConfigAsyncOptions,
    EmailConfigOptions,
} from './interface/email_config_options.interface';
import { EMAIL_CONFIG_OPTIONS } from './constant';
import { ConfigurableModuleClass } from '@nestjs/common/cache/cache.module-definition';

@Module({})
export class EmailModule extends ConfigurableModuleClass {
    static forRoot(
        options: EmailConfigOptions & Pick<EmailConfigAsyncOptions, 'isGlobal'>,
    ): DynamicModule {
        return {
            module: EmailModule,
            providers: [
                {
                    provide: EMAIL_CONFIG_OPTIONS,
                    useValue: options,
                },
                EmailService,
            ],
            exports: [EmailService],
            global: options.isGlobal || false,
        };
    }

    static forRootAsync(options: EmailConfigAsyncOptions): DynamicModule {
        return {
            module: EmailModule,
            providers: [
                {
                    provide: EMAIL_CONFIG_OPTIONS,
                    useFactory: options.useFactory,
                    inject: options.inject,
                },
                EmailService,
            ],
            exports: [EmailService],
            global: options.isGlobal || false,
        };
    }
}
