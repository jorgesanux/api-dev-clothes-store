import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { DeleteResult, QueryFailedError, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import {
    CreateProductDTO,
    UpdateProductDTO,
} from 'src/product/dto/product.dto';
import { Product } from 'src/product/entity/product.entity';
import { BaseServiceInterface } from 'src/common/interface/base-service.interface';
import { QueryFailedErrorHandler } from "src/common/handler/query_failed_error.handler";
import { BrandService } from "./brand.service";


@Injectable()
export class ProductService implements BaseServiceInterface<Product, string> {

    relations: string[] = ["brand", "categories"];

    constructor(
        @InjectRepository(Product) private productRepository: Repository<Product>,
        private brandService: BrandService,
    ) {}

    async findAll(limit: number, page: number, relations = this.relations): Promise<[Product[], number]> {
        return this.productRepository.findAndCount({
            relations,
            order: { id: 'DESC' },
            take: limit,
            skip: limit * page - limit,
        });
    }

    async findOne(id: string, relations = this.relations): Promise<Product> {
        const product: Product = await this.productRepository.findOne({
            relations,
            where: {
                id
            }
        });
        if (product !== null) return product;

        throw new NotFoundException(`Product with id ${id} not found`);
    }

    async create(payload: CreateProductDTO): Promise<Product> {
        try {
            const product: Product = this.productRepository.create(payload);
            product.brand = await this.brandService.findOne(payload.brandId);
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
            if(payload.brandId) product.brand = await this.brandService.findOne(payload.brandId);
            await this.productRepository.merge(product, payload);
            return await this.productRepository.save(product);
        } catch (e: unknown) {
            if (e instanceof QueryFailedError)
                QueryFailedErrorHandler.handle(e as QueryFailedError);
            throw e;
        }
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
}
