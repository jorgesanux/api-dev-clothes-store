import { Inject, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { EmailConfigOptions } from '../interface/email_config_options.interface';
import { MailOptions } from '../interface/mail_options.interface';
import { EMAIL_CONFIG_OPTIONS } from '../constant';

@Injectable()
export class EmailService {
    private transporter: Transporter<SMTPTransport.SentMessageInfo>;
    constructor(
        @Inject(EMAIL_CONFIG_OPTIONS)
        private readonly emailConfigOptions: EmailConfigOptions,
    ) {
        this.transporter = nodemailer.createTransport(
            this.emailConfigOptions.smtpTransportConfig,
            this.emailConfigOptions.smtpTransportDefaults || {},
        );
    }
    async sendEmail(mailOptions: MailOptions) {
        const info: SMTPTransport.SentMessageInfo =
            await this.transporter.sendMail(mailOptions);
    }
}
