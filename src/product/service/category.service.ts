import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import {
    Between,
    DeleteResult,
    FindOptionsWhere,
    In,
    Like,
    QueryFailedError,
    Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import {
    QueryCategoryDTO,
    CreateCategoryDTO,
    UpdateCategoryDTO,
} from 'src/product/dto/category.dto';
import { Category } from 'src/product/entity/category.entity';
import { IBaseCRUDService } from 'src/common/interface/base_crud_service.interface';
import { QueryFailedErrorHandler } from 'src/common/handler/query_failed_error.handler';

@Injectable()
export class CategoryService implements IBaseCRUDService<Category, string> {
    relations: string[] | Object;
    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
    ) {}

    async findAll(queryDTO: QueryCategoryDTO): Promise<[Category[], number]> {
        const {
            limit,
            page,
            updatedAtInit,
            updatedAtEnd,
            createdAtInit,
            createdAtEnd,
            name,
            description,
        } = queryDTO;
        const where: FindOptionsWhere<Category> = {
            name: name ? Like(`%${name}%`) : undefined,
            description: description ? Like(`%${description}%`) : undefined,
            updatedAt:
                updatedAtInit && updatedAtEnd
                    ? Between(updatedAtInit, updatedAtEnd)
                    : undefined,
            createdAt:
                createdAtInit && createdAtEnd
                    ? Between(createdAtInit, createdAtEnd)
                    : undefined,
        };
        return this.categoryRepository.findAndCount({
            where,
            order: { createdAt: 'DESC' },
            take: limit,
            skip: limit * page - limit,
        });
    }

    async findOne(id: string): Promise<Category> {
        const category: Category = await this.categoryRepository.findOneBy({
            id,
        });
        if (category !== null) return category;

        throw new NotFoundException(`Category with id ${id} not found`);
    }

    async findMany(ids: string[]): Promise<Category[]> {
        const categories: Category[] = await this.categoryRepository.findBy({
            id: In(ids),
        });
        for (const id of ids) {
            if (categories.findIndex((c) => c.id === id) === -1)
                throw new NotFoundException(`Category with id ${id} not found`);
        }
        return categories;
    }

    async create(payload: CreateCategoryDTO): Promise<Category> {
        try {
            const category: Category = this.categoryRepository.create(payload);
            return await this.categoryRepository.save(category);
        } catch (e: unknown) {
            if (e instanceof QueryFailedError)
                QueryFailedErrorHandler.handle(e as QueryFailedError);
            throw e;
        }
    }

    async update(id: string, payload: UpdateCategoryDTO): Promise<Category> {
        try {
            const category: Category = await this.findOne(id);
            await this.categoryRepository.merge(category, payload);
            return await this.categoryRepository.save(category);
        } catch (e: unknown) {
            if (e instanceof QueryFailedError)
                QueryFailedErrorHandler.handle(e as QueryFailedError);
            throw e;
        }
    }

    async delete(id: string): Promise<Category> {
        const category: Category = await this.findOne(id);
        const result: DeleteResult = await this.categoryRepository.delete({
            id: category.id,
        });
        if (result.affected > 0) return category;
        throw new InternalServerErrorException(
            `Can not delete the category with id ${id}`,
        );
    }
}
