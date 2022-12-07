import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
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
            isGlobal: true
        }),
        UserModule,
        ProductModule,
        OrderModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
