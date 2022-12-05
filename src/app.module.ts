import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductController } from './controller/product.controller';
import { CategoryController } from './controller/category.controller';
import { UserController } from './controller/user.controller';
import { CustomerController } from './controller/customer.controller';
import { BrandController } from './controller/brand.controller';
import { ProductService } from './service/product.service';
import { CategoryService } from './service/category.service';
import { BrandService } from './service/brand.service';
import { UserService } from './service/user.service';
import { CustomerService } from './service/customer.service';

@Module({
    imports: [],
    controllers: [
        AppController,
        ProductController,
        CategoryController,
        UserController,
        CustomerController,
        BrandController,
    ],
    providers: [
        AppService,
        ProductService,
        CategoryService,
        BrandService,
        UserService,
        CustomerService,
    ],
})
export class AppModule {}
