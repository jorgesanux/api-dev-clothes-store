import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import {
    ArrayContains,
    Between,
    DeleteResult,
    FindOptionsWhere,
    Like,
    QueryFailedError,
    Repository
} from "typeorm";
import { InjectRepository } from '@nestjs/typeorm';

import {
    CreateProductDTO,
    QueryProductDTO,
    UpdateProductDTO,
} from 'src/product/dto/product.dto';
import { Product } from 'src/product/entity/product.entity';
import { BaseServiceInterface } from 'src/common/interface/base-service.interface';
import { QueryFailedErrorHandler } from 'src/common/handler/query_failed_error.handler';
import { BrandService } from './brand.service';
import { CategoryService } from './category.service';
import { Category } from '../entity/category.entity';

@Injectable()
export class ProductService implements BaseServiceInterface<Product, string> {
    relations: string[] = ['brand', 'categories'];

    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        private brandService: BrandService,
        private categoryService: CategoryService,
    ) {}

    async findAll(
        queryDTO: QueryProductDTO,
        relations = this.relations,
    ): Promise<[Product[], number]> {
        const {
            brandId,
            limit,
            createdAtEnd,
            page,
            updatedAtEnd,
            updatedAtInit,
            createdAtInit,
            priceInit,
            priceEnd,
            stockInit,
            stockEnd,
            description,
            name,
            image,
            categoryId,
        } = queryDTO;
        const where: FindOptionsWhere<Product> = {
            brand: {
                id: brandId ? brandId : undefined
            },
            categories: {
                id: categoryId ? categoryId : undefined
            },
            price:
                priceInit && priceEnd
                    ? Between(priceInit, priceEnd)
                    : undefined,
            stock:
                stockInit && stockEnd
                    ? Between(stockInit, stockEnd)
                    : undefined,
            name: name ? Like(`%${name}%`) : undefined,
            description: description ? Like(`%${description}%`) : undefined,
            image,
            updatedAt:
                updatedAtInit && updatedAtEnd
                    ? Between(updatedAtInit, updatedAtEnd)
                    : undefined,
            createdAt:
                createdAtInit && createdAtEnd
                    ? Between(createdAtInit, createdAtEnd)
                    : undefined,
        };

        return this.productRepository.findAndCount({
            relations,
            where,
            order: { createdAt: 'DESC' },
            take: limit,
            skip: limit * page - limit,
        });
    }

    async findOne(id: string, relations = this.relations): Promise<Product> {
        const product: Product = await this.productRepository.findOne({
            relations,
            where: {
                id,
            },
        });
        if (product !== null) return product;

        throw new NotFoundException(`Product with id ${id} not found`);
    }

    async create(payload: CreateProductDTO): Promise<Product> {
        try {
            const product: Product = this.productRepository.create(payload);
            product.brand = await this.brandService.findOne(payload.brandId);
            product.categories = await this.categoryService.findMany(
                payload.categoriesIds,
            );
            return await this.productRepository.save(product);
        } catch (e: unknown) {
            if (e instanceof QueryFailedError)
                QueryFailedErrorHandler.handle(e as QueryFailedError);
            throw e;
        }
    }

    async update(id: string, payload: UpdateProductDTO): Promise<Product> {
        try {
            const product: Product = await this.findOne(id);

            if (payload.brandId)
                product.brand = await this.brandService.findOne(
                    payload.brandId,
                );

            if (payload.categoriesIds)
                product.categories = await this.categoryService.findMany(
                    payload.categoriesIds,
                );

            await this.productRepository.merge(product, payload);
            return await this.productRepository.save(product);
        } catch (e: unknown) {
            if (e instanceof QueryFailedError)
                QueryFailedErrorHandler.handle(e as QueryFailedError);
            throw e;
        }
    }

    async addCategory(idProduct: string, idCategory: string): Promise<Product> {
        const product: Product = await this.findOne(idProduct);

        if (product.categories.findIndex((c) => c.id === idCategory) !== -1)
            throw new ConflictException(
                `Category with id ${idCategory} already exists as relation on Product with id ${idProduct}`,
            );

        product.categories.push(await this.categoryService.findOne(idCategory));
        return this.productRepository.save(product);
    }

    async delete(id: string): Promise<Product> {
        const product: Product = await this.findOne(id);
        const result: DeleteResult = await this.productRepository.delete({
            id: product.id,
        });
        if (result.affected > 0) return product;
        throw new InternalServerErrorException(
            `Can not delete the product with id ${id}`,
        );
    }

    async deleteCategory(
        idProduct: string,
        idCategory: string,
    ): Promise<Product> {
        const product: Product = await this.findOne(idProduct);
        const indexCategory: number = product.categories.findIndex(
            (c) => c.id === idCategory,
        );

        if (indexCategory === -1)
            throw new NotFoundException(
                `Category with id ${idCategory} not found as relation on Product with id ${idProduct}`,
            );

        if (product.categories.length === 1)
            throw new ConflictException(
                `Product with id ${idProduct} must have at least one category. Cannot delete the only category.`,
            );

        product.categories.splice(indexCategory, 1);
        return this.productRepository.save(product);
    }
}
