import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDTO, UpdateProductDTO } from 'src/dto/product.dto';

import { Product } from 'src/entity/product.entity';
import { BaseServiceInterface } from 'src/interface/base-service.interface';

@Injectable()
export class ProductService implements BaseServiceInterface<Product, number> {
    private SEQUENCE = 0;

    private products: Product[] = [];

    findAll(): Product[] {
        return this.products;
    }

    findOne(id: number): Product {
        const product: Product = this.products.find((p) => p.id === id);
        if (!product) {
            throw new NotFoundException(`Product with id ${id} not found`);
        }
        return product;
    }

    create(payload: CreateProductDTO): Product {
        this.SEQUENCE++;
        const product: Product = {
            id: this.SEQUENCE,
            ...payload,
        };
        this.products.push(product);
        return product;
    }

    update(id: number, payload: UpdateProductDTO): Product {
        const productIndex = this.products.findIndex((p) => p.id === id);
        if (productIndex < 0) {
            throw new NotFoundException(`Product with id ${id} not found`);
        }
        return Object.assign(this.products[productIndex], payload);
    }

    delete(id: number): Product {
        const productIndex = this.products.findIndex((p) => p.id === id);
        if (productIndex < 0) {
            throw new NotFoundException(`Product with id ${id} not found`);
        }
        return this.products.splice(productIndex, 1)[0];
    }
}
