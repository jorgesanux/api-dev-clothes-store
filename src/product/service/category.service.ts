import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { DeleteResult, QueryFailedError, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import {
    CreateCategoryDTO,
    UpdateCategoryDTO,
} from 'src/product/dto/category.dto';
import { Category } from 'src/product/entity/category.entity';
import { BaseServiceInterface } from 'src/common/interface/base-service.interface';
import { QueryFailedErrorHandler } from 'src/common/handler/query_failed_error.handler';

@Injectable()
export class CategoryService implements BaseServiceInterface<Category, string> {
    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
    ) {}

    async findAll(limit: number, page: number): Promise<[Category[], number]> {
        return this.categoryRepository.findAndCount({
            order: { id: 'DESC' },
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
