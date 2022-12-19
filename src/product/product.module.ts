import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductController } from './controller/product.controller';
import { ProductService } from './service/product.service';
import { Product } from './entity/product.entity';
import { BrandController } from './controller/brand.controller';
import { CategoryController } from './controller/category.controller';
import { BrandService } from './service/brand.service';
import { CategoryService } from './service/category.service';
import { Brand } from './entity/brand.entity';
import { Category } from './entity/category.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Product, Brand, Category])],
    controllers: [ProductController, CategoryController, BrandController],
    providers: [ProductService, CategoryService, BrandService],
    exports: [ProductService],
})
export class ProductModule {}
