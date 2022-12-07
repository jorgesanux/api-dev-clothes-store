import { Module } from '@nestjs/common';
import { OrderService } from './service/order.service';
import { OrderController } from './controller/order.controller';
import { UserModule } from 'src/user/user.module';
import { ProductModule } from 'src/product/product.module';

@Module({
    imports: [UserModule, ProductModule],
    providers: [OrderService],
    controllers: [OrderController],
})
export class OrderModule {}
