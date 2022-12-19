import { Module } from '@nestjs/common';
import { OrderService } from './service/order.service';
import { OrderController } from './controller/order.controller';
import { UserModule } from 'src/user/user.module';
import { ProductModule } from 'src/product/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { OrderItem } from './entity/order_item.entity';
import { OrderItemService } from './service/order_item.service';
import { OrderItemController } from './controller/order_item.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Order, OrderItem]),
        ProductModule,
        UserModule,
    ],
    providers: [OrderService, OrderItemService],
    controllers: [OrderController, OrderItemController],
})
export class OrderModule {}
