import { RouteTree } from '@nestjs/core';
import { ApiModule } from './api.module';
import { UserModule } from '../user/user.module';
import { ProductModule } from '../product/product.module';
import { OrderModule } from '../order/order.module';
import { AuthModule } from '../auth/auth.module';

export const ApiRoute: RouteTree = {
    path: 'api',
    module: ApiModule,
    children: [UserModule, ProductModule, OrderModule, AuthModule],
};
