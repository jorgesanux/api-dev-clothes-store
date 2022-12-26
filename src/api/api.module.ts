import { Module } from '@nestjs/common';
import { ApiController } from './controller/api.controller';
import { UserModule } from '../user/user.module';
import { ProductModule } from '../product/product.module';
import { OrderModule } from '../order/order.module';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        UserModule,
        ProductModule,
        OrderModule,
        DatabaseModule,
        AuthModule,
    ],
    controllers: [ApiController],
})
export class ApiModule {}
