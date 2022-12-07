import { Module } from '@nestjs/common';
import { BrandController } from './controller/brand.controller';
import { CategoryController } from './controller/category.controller';
import { ProductController } from './controller/product.controller';
import { BrandService } from './service/brand.service';
import { CategoryService } from './service/category.service';
import { ProductService } from './service/product.service';

@Module({
    controllers: [ProductController, CategoryController, BrandController],
    providers: [ProductService, CategoryService, BrandService],
    exports: [ProductService],
})
export class ProductModule {}
