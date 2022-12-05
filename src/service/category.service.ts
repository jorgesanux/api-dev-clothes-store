import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDTO, UpdateCategoryDTO } from 'src/dto/category.dto';
import { Category } from 'src/entity/category.entity';
import { BaseServiceInterface } from 'src/interface/base-service.interface';

@Injectable()
export class CategoryService implements BaseServiceInterface<Category, number> {
    private SEQUENCE = 0;
    private categories: Category[] = [];

    findAll(): Category[] {
        return this.categories;
    }

    findOne(id: number): Category {
        const category: Category = this.categories.find((c) => c.id === id);
        if (!category) {
            throw new NotFoundException(`Category with id ${id} not found`);
        }
        return category;
    }

    create(payload: CreateCategoryDTO): Category {
        this.SEQUENCE++;
        const category: Category = {
            id: this.SEQUENCE,
            ...payload,
        };
        this.categories.push(category);
        return category;
    }

    update(id: number, payload: UpdateCategoryDTO): Category {
        const categoryIndex = this.categories.findIndex((c) => c.id === id);
        if (categoryIndex < 0) {
            throw new NotFoundException(`Category with id ${id} not found`);
        }
        return Object.assign(this.categories[categoryIndex], payload);
    }

    delete(id: number): Category {
        const categoryIndex = this.categories.findIndex((c) => c.id === id);
        if (categoryIndex < 0) {
            throw new NotFoundException(`Category with id ${id} not found`);
        }
        return this.categories.splice(categoryIndex, 1)[0];
    }
}
