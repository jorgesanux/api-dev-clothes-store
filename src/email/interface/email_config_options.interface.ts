import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { FactoryProvider, ModuleMetadata } from '@nestjs/common';

export interface EmailConfigOptions {
    smtpTransportConfig: SMTPTransport.Options;
    smtpTransportDefaults?: SMTPTransport.Options;
}

export interface EmailConfigAsyncOptions
    extends Pick<ModuleMetadata, 'imports'>,
        Pick<FactoryProvider<EmailConfigOptions>, 'useFactory' | 'inject'> {
    isGlobal?: boolean;
}
