import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as morgan from 'morgan';
import helmet from 'helmet';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            disableErrorMessages: process.env.ENVIRONMENT === 'production',
        }),
    );
    app.use(morgan('dev'));
    app.use(helmet());
    app.enableCors();

    const configSwagger = new DocumentBuilder()
        .setTitle('API Dev clothes Store')
        .setDescription("API developed in base to Platzi's NestJs course")
        .setVersion('0.0.1')
        .setContact(
            'Jorge Sanabria',
            'https://github.com/jorgesanux',
            'jorgesanux1@gmail.com',
        )
        .build();
    const documentSwagger = SwaggerModule.createDocument(app, configSwagger);
    SwaggerModule.setup('docs', app, documentSwagger, {
        customfavIcon: '/public/favicon/favicon.ico',
        customSiteTitle: "Api Dev Clothes Store | Swagger",
        customCssUrl: '/public/css/swagger-dark.css'
    });

    await app.listen(process.env.PORT || 3000);
}
bootstrap();
